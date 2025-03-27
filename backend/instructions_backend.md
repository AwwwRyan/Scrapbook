# Backend (Django + Python Socket.IO)

## Overview

The backend is built using Django with Django REST Framework (DRF) for API handling.

It supports authentication, reviews, recommendations, chat (real-time with Socket.IO), and watchlist management.

## 0. Movie page

*

## 1. Movie Recommendations section

* A recommendation system suggests movies based on those rated more than 3.5 stars.
* Uses RapidAPI's IMDb API to fetch movie details of those movies.
* The recommendation system stores movies as tuples with their scores:

    ```python
    [('The Matrix', 9.40), ('The Dark Knight Rises', 9.28), ...]
    ```

* Extracts movie names and searches them via the API to fetch details.

## 2. Chat Functionality (Real-Time with Socket.IO)

### Tech Stack

* Socket.IO for real-time communication.
* Python-SocketIO for handling WebSocket connections in Django.
* Next.js + socket.io-client for frontend chat.
* ASGI for WebSocket support.

## 3. ASGI Configuration for WebSockets

### ASGI Configuration (asgi.py)

```python
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter
from chat.socket_server import socket_app

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scrapbook.settings')

django_application = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_application,
    "websocket": socket_app,
})
```
## 4. Socket.IO Server Implementation (socket_server.py)

```python
import socketio

# Create Socket.IO server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=['http://localhost:3000']
)

# Create ASGI application
socket_app = socketio.ASGIApp(
    socketio_server=sio,
    socketio_path='socket.io'
)

# Socket.IO event handlers
@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

@sio.event
async def message(sid, data):
    print(f"Message received from {sid}: {data}")
    # Broadcast the message to all connected clients
    await sio.emit('message', data)
```
## 5. Watchlist & Reviews API (Django REST Framework)

* Users can add movies to their watchlist via Django API.
* Movies can be marked as watched and reviews can be added.
* Django REST Framework (DRF) handles CRUD operations.

## 6. API Integration with Frontend

* Frontend calls Django APIs using Axios.
* Django returns JSON responses for movies, reviews, watchlists, and chat data.

## folder structure
scrapbook
│── .gitignore
│── db.sqlite3
│── manage.py
│
├── api
│   └── urls.py
│
├── authentication
│   │── admin.py
│   │── apps.py
│   │── models.py
│   │── serializers.py
│   │── tests.py
│   │── views.py
│   └── migrations
│       └── 0001_initial.py
│
├── chat
│   │── admin.py
│   │── apps.py
│   │── consumer.py
│   │── models.py
│   │── socket_server.py
│   │── tests.py
│   │── views.py
│   └── migrations
│
├── movie_module
│   │── admin.py
│   │── apps.py
│   │── models.py
│   │── serializers.py
│   │── tests.py
│   │── views.py
│
└── scrapbook
    │── asgi.py
    │── settings.py
    │── urls.py
    └── wsgi.py
