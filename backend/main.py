from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import json

import database, models, schemas, auth

# Initialize database
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ConnectionManager:
    def __init__(self):
        # { user_id: { "ws": WebSocket, "name": str } }
        self.users: dict[str, dict] = {}

    async def connect(self, websocket: WebSocket, user_id: str, name: str):
        await websocket.accept()
        self.users[user_id] = {"ws": websocket, "name": name}
        await self.broadcast_user_list()

    def disconnect(self, user_id: str):
        if user_id in self.users:
            del self.users[user_id]

    async def broadcast_user_list(self):
        """Send the online user list to every connected client."""
        user_list = [{"id": uid, "name": info["name"]} for uid, info in self.users.items()]
        message = json.dumps({"type": "online_users", "users": user_list})
        for info in self.users.values():
            try:
                await info["ws"].send_text(message)
            except Exception:
                pass

    async def send_to(self, user_id: str, message: dict):
        if user_id in self.users:
            try:
                await self.users[user_id]["ws"].send_text(json.dumps(message))
            except Exception:
                pass


manager = ConnectionManager()

# Message types routed between users:
ROUTED_TYPES = {
    "friend_request", "friend_accept", "friend_reject",
    "chat",
    "offer", "answer", "candidate",
}

@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Also check if ID is taken
    db_user_id = db.query(models.User).filter(models.User.id == user.id).first()
    if db_user_id:
        raise HTTPException(status_code=400, detail="User ID already taken")

    hashed_pw = auth.get_password_hash(user.password)
    new_user = models.User(
        id=user.id,
        username=user.username,
        name=user.name,
        hashed_password=hashed_pw
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login", response_model=schemas.Token)
def login(login_data: schemas.UserLogin, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.username == login_data.username).first()
    if not user or not auth.verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.websocket("/ws/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str):
    db = next(database.get_db())
    user = await auth.get_user_from_token(token, db)
    
    if not user:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    user_id = user.id
    display_name = user.name
    
    await manager.connect(websocket, user_id, display_name)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            msg_type = message.get("type")
            target_id = message.get("target")

            if msg_type in ROUTED_TYPES and target_id:
                # Always stamp the sender info
                message["from"] = user_id
                message["fromName"] = display_name
                await manager.send_to(target_id, message)
    except WebSocketDisconnect:
        manager.disconnect(user_id)
        await manager.broadcast_user_list()


@app.get("/")
async def root():
    return {
        "message": "Connecta Signaling Server Running",
        "online": len(manager.users),
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
