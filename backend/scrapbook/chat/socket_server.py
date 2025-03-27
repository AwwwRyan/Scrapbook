import socketio
from django.conf import settings
from django.db import models
from .models import Message

# Create Socket.IO server with configuration from settings
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=['http://localhost:3000'] if settings.DEBUG else settings.ALLOWED_HOSTS
)

# Create ASGI application
socket_app = socketio.ASGIApp(
    socketio_server=sio,
    socketio_path='socket.io'
)

# Store user information (optional)
connected_users = {}

# Socket.IO event handlers
@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")
    connected_users[sid] = {'user_id': None}  # You can store additional user info here

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")
    if sid in connected_users:
        del connected_users[sid]

@sio.event
async def message(sid, data):
    print(f"Message received from {sid}: {data}")
    # Broadcast the message to all connected clients
    await sio.emit('message', data)

@sio.event
async def private_message(sid, data):
    """
    Handle private messages between users
    data should contain: {
        'to_user': 'target_sid',
        'message': 'message_content'
    }
    """
    if 'to_user' in data and 'message' in data:
        target_sid = data['to_user']
        # Send message only to the specified user
        await sio.emit('private_message', 
                      {'from': sid, 'message': data['message']}, 
                      room=target_sid)

@sio.event
async def join_room(sid, room_name):
    """Allow users to join specific rooms for group messaging"""
    sio.enter_room(sid, room_name)
    await sio.emit('room_joined', {'room': room_name}, room=sid)

@sio.event
async def get_message_history(sid, data):
    """
    Retrieve message history with a specific user
    data should contain: {
        'other_user_id': 'user_id'
    }
    """
    current_user = connected_users[sid]['user_id']
    other_user = data['other_user_id']
    
    messages = Message.objects.filter(
        ((models.Q(from_user=current_user) & models.Q(to_user=other_user)) |
         (models.Q(from_user=other_user) & models.Q(to_user=current_user)))
    ).order_by('timestamp')
    
    # Convert messages to a format that can be sent via Socket.IO
    message_history = [
        {
            'from': msg.from_user.id,
            'message': msg.content,
            'timestamp': msg.timestamp.isoformat()
        }
        for msg in messages
    ]
    
    await sio.emit('message_history', message_history, room=sid)