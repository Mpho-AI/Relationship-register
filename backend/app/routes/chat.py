from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from typing import Dict, List, Optional
import json
from app.services.auth import get_current_user
from app.models import ChatMessage, PrimaryUser
from app.database import get_db
from sqlalchemy.orm import Session
 
router = APIRouter()

# Store active connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_text(message)

manager = ConnectionManager()

@router.websocket("/ws/{chat_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    chat_id: str,
    current_user: dict = Depends(get_current_user)
):
    await manager.connect(websocket, current_user["id"])
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Save message to database
            db = next(get_db())
            chat_message = ChatMessage(
                chat_id=chat_id,
                sender_id=current_user["id"],
                recipient_id=message_data["recipientId"],
                message=message_data["message"]
            )
            db.add(chat_message)
            db.commit()
            
            # Send to recipient if online
            await manager.send_personal_message(
                json.dumps({
                    "message": message_data["message"],
                    "senderId": current_user["id"],
                    "timestamp": message_data["timestamp"]
                }),
                message_data["recipientId"]
            )
    except WebSocketDisconnect:
        manager.disconnect(current_user["id"]) 