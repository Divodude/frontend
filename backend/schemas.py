from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    username: str
    name: str

class UserCreate(UserBase):
    id: str  # Unique ID chosen by user
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
