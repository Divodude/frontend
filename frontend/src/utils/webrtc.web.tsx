import React, { useEffect, useRef } from 'react';

// Polyfill MediaStream.toURL() for web
if (typeof window !== 'undefined' && window.MediaStream && !(window.MediaStream.prototype as any).toURL) {
  (window.MediaStream.prototype as any).toURL = function() {
    return this;
  };
}

export const RTCPeerConnection = window.RTCPeerConnection || (window as any).webkitRTCPeerConnection;
export const RTCIceCandidate = window.RTCIceCandidate;
export const RTCSessionDescription = window.RTCSessionDescription;
export const mediaDevices = window.navigator.mediaDevices;
export const MediaStream = window.MediaStream;

export const RTCView = ({ streamURL, style, objectFit, zOrder }: any) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && streamURL) {
      videoRef.current.srcObject = streamURL as any;
    }
  }, [streamURL]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={zOrder === 1} // Mute local preview
      style={{
        ...style,
        objectFit: objectFit || 'cover',
        display: 'flex',
        width: '100%',
        height: '100%',
      }}
    />
  );
};
