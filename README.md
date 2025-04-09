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

# Scrapbook API Documentation

## Movie Module APIs

### Get All Movies 
```
GET /movies/
```
**Headers:**
- No specific headers required

**Response:**
```json
[
    {
        "id": "tt1234567",
        "title": "Example Movie",
        "description": "Movie description",
        "image_url": "https://example.com/image.jpg",
        "release_date": "2024-03-28",
        "genres": ["Action", "Drama"],
        "rating": 4.5,
        "runtime_minutes": 120
    }
]
```

### Get Movie Detail
```
GET /movies/{movie_id}/
```
**Headers:**
- No specific headers required

**Response:**
```json
{
    "id": "tt1234567",
    "title": "Example Movie",
    "original_title": "Original Movie Title",
    "description": "Movie description",
    "image_url": "https://example.com/image.jpg",
    "release_date": "2024-03-28",
    "start_year": 2024,
    "end_year": null,
    "runtime_minutes": 120,
    "genres": ["Action", "Drama"],
    "language": "English",
    "countries": ["USA", "UK"],
    "rating": 4.5,
    "num_votes": 1000,
    "budget": 1000000,
    "gross_worldwide": 5000000,
    "is_adult": false
}
```

### Add Movie
```
POST /movies/add/
```
**Headers:**
- Authorization: Bearer {token}

**Request Body:**
```json
{
    "id": "tt1234567",
    "title": "New Movie",
    "description": "Movie description",
    "image_url": "https://example.com/image.jpg",
    "release_date": "2024-03-28",
    "genres": ["Action", "Drama"]
}
```

**Response:**
```json
{
    "id": "tt1234567",
    "title": "New Movie",
    "description": "Movie description",
    "image_url": "https://example.com/image.jpg",
    "release_date": "2024-03-28",
    "genres": ["Action", "Drama"]
}
```

### Get Movie Reviews
```
GET /movies/{movie_id}/reviews/
```
**Headers:**
- No specific headers required

**Response:**
```json
[
    {
        "id": 1,
        "user": "username",
        "movie": "tt1234567",
        "rating": 4.5,
        "review_text": "Great movie!",
        "created_at": "2024-03-28T10:30:00Z"
    }
]
```

### Create Review
```
POST /movies/{movie_id}/reviews/create/
```
**Headers:**
- Authorization: Bearer {token}

**Request Body:**
```json
{
    "rating": 4.5,        // Required, float between 0 and 5
    "review_text": "Great movie!"  // Optional
}
```

**Response:**
```json
{
    "id": 1,
    "user": "username",
    "movie": "tt1234567",
    "rating": 4.5,
    "review_text": "Great movie!",
    "created_at": "2024-03-28T10:30:00Z"
}
```

### Manage Review
```
PUT /reviews/{review_id}/
```
**Headers:**
- Authorization: Bearer {token}

**Request Body:**
```json
{
    "rating": 4.0,
    "review_text": "Updated review text"
}
```

**Response:**
```json
{
    "id": 1,
    "user": "username",
    "movie": "tt1234567",
    "rating": 4.0,
    "review_text": "Updated review text",
    "created_at": "2024-03-28T10:30:00Z"
}
```

```
DELETE /reviews/{review_id}/
```
**Headers:**
- Authorization: Bearer {token}

**Response:**
- Status: 204 No Content

### Get User Reviews
```
GET /users/reviews/
```
**Headers:**
- Authorization: Bearer {token}

**Response:**
```json
[
    {
        "id": 1,
        "user": "username",
        "movie": "tt1234567",
        "rating": 4.5,
        "review_text": "Great movie!",
        "created_at": "2024-03-28T10:30:00Z"
    }
]
```

### Watch Later APIs

#### Get Watch Later List
```
GET /watch-later/
```
**Headers:**
- Authorization: Bearer {token}

**Response:**
```json
[
    {
        "id": 1,
        "user": "username",
        "movie": {
            "id": "tt1234567",
            "title": "Example Movie",
            "original_title": "Original Movie Title",
            "description": "Movie description",
            "image_url": "https://example.com/image.jpg",
            "release_date": "2024-03-28",
            "start_year": 2024,
            "end_year": null,
            "runtime_minutes": 120,
            "genres": ["Action", "Drama"],
            "language": "English",
            "countries": ["USA", "UK"],
            "rating": 4.5,
            "num_votes": 1000,
            "budget": 1000000,
            "gross_worldwide": 5000000,
            "is_adult": false
        },
        "added_at": "2024-03-28T10:30:00Z"
    }
]
```

#### Add to Watch Later
```
POST /watch-later/add/{movie_id}/
```

## Error Responses

### 400 Bad Request
```json
{
    "rating": ["This field is required."],
    "review_text": ["This field may not be blank."]
}
```

### 401 Unauthorized
```json
{
    "detail": "Authentication credentials were not provided."
}
```

### 404 Not Found
```json
{
    "detail": "Not found."
}
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

To obtain a token, use the login endpoint:
```
POST /users/login/
```

Protected endpoints are marked with:
- Authorization: Bearer {token}
in the Headers section.

## Pagination

For endpoints returning lists, the response format includes pagination:

```json
{
    "count": 100,
    "next": "http://api.example.org/movies/?page=2",
    "previous": null,
    "results": [
        // ... items ...
    ]
}
```

## Common Query Parameters

- `page`: Page number for paginated results
- `search`: Search term for filtering results
- `sort`: Sort field (e.g., 'release_date', '-rating' for descending)
```
