# Scrapbook: Movie Review & Recommendation App

A collaborative platform for movie enthusiasts to log, review, and discuss films.

## Table of Contents
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Database Models](#database-models)
- [Application Flow & Features](#application-flow--features)
  - [Authentication](#1-authentication)
  - [Homepage](#2-homepage)
  - [Search Functionality](#3-search-functionality)
  - [Movie Details Page](#4-movie-details-page)
  - [Review System](#5-review-system)
  - [Watchlist Management](#6-watchlist-management)
  - [User Profile](#7-user-profile)
  - [Analytics Dashboard](#8-analytics-dashboard)
- [Profile Components](#profile-components)
- [UI/UX Features](#uiux-features)
- [Data Management](#data-management)
- [Development Guidelines](#development-guidelines)
- [UI Components](#ui-components)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [API Documentation](#scrapbook-api-documentation)
  - [Movie Module APIs](#movie-module-apis)
  - [Error Responses](#error-responses)
  - [Authentication](#authentication)
  - [Pagination](#pagination)
  - [Common Query Parameters](#common-query-parameters)

## Frontend Architecture
- Built with Next.js + React
- UI powered by ShadCN UI for modular and aesthetic components
- State Management using Zustand
- Authentication using JWT tokens
- Responsive design with Tailwind CSS

## Backend Architecture

### Overview

The backend is built using Django with Django REST Framework (DRF) for API handling.

It supports authentication, reviews, recommendations, chat (real-time with Socket.IO), and watchlist management.

### 1. Movie Recommendations Section

* A recommendation system suggests movies based on those rated more than 3.5 stars.
* Uses RapidAPI's IMDb API to fetch movie details of those movies.
* The recommendation system stores movies as tuples with their scores:

    ```python
    [('The Matrix', 9.40), ('The Dark Knight Rises', 9.28), ...]
    ```

* Extracts movie names and searches them via the API to fetch details.

### 2. Chat Functionality (Real-Time with Socket.IO)

#### Tech Stack

* Socket.IO for real-time communication.
* Python-SocketIO for handling WebSocket connections in Django.
* Next.js + socket.io-client for frontend chat.
* ASGI for WebSocket support.

### 3. ASGI Configuration for WebSockets

#### ASGI Configuration (asgi.py)

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

### 4. Socket.IO Server Implementation (socket_server.py)

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

### 5. Watchlist & Reviews API (Django REST Framework)

* Users can add movies to their watchlist via Django API.
* Movies can be marked as watched and reviews can be added.
* Django REST Framework (DRF) handles CRUD operations.

### 6. API Integration with Frontend

* Frontend calls Django APIs using Axios.
* Django returns JSON responses for movies, reviews, watchlists, and chat data.

## Database Models

### Review Model
```python
class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews")
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="reviews")
    rating = models.FloatField()  # Rating out of 5
    review_text = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'movie')  # One review per user per movie

    def __str__(self):
        return f"{self.user.name} - {self.movie.title} ({self.rating})"
```

### WatchLater Model
```python
class WatchLater(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="watchlist")
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="watchlist")
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'movie')  # Avoid duplicate watch later entries

    def __str__(self):
        return f"{self.user.name} wants to watch {self.movie.title}"
```

### Movie Model
```python
class Movie(models.Model):
    id = models.CharField(max_length=20, primary_key=True)  # IMDB ID
    title = models.CharField(max_length=255)
    original_title = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    image_url = models.URLField(null=True, blank=True)
    release_date = models.DateField(null=True, blank=True)
    start_year = models.IntegerField(null=True, blank=True)
    end_year = models.IntegerField(null=True, blank=True)
    runtime_minutes = models.IntegerField(null=True, blank=True)
    genres = models.JSONField(null=True, blank=True)  # Store genres as a list
    language = models.CharField(max_length=50, null=True, blank=True)
    countries = models.JSONField(null=True, blank=True)  # Store country list
    rating = models.FloatField(null=True, blank=True)
    num_votes = models.IntegerField(null=True, blank=True)
    budget = models.BigIntegerField(null=True, blank=True)
    gross_worldwide = models.BigIntegerField(null=True, blank=True)
    is_adult = models.BooleanField(default=False)
    
    def __str__(self):
        return self.title
```

## Application Flow & Features

### 1. Authentication
- JWT-based authentication
- Protected routes for authenticated users
- Token storage in localStorage
- Automatic token refresh
- Redirect handling for protected routes

#### Authentication Endpoints
- Login: `POST /api/auth/login/`
- Register: `POST /api/auth/register/`
- Token Refresh: `POST /api/auth/token/refresh/`

### 2. Homepage
- No authentication required
- Features:
  - Popular movies section
  - Top rated movies section
  - Search functionality
  - Movie cards with hover effects
  - Lazy loading for better performance
- Uses ShadCN's Card component for movie display

#### Movie Display Components
- MovieCard: Displays individual movie information
- MovieGrid: Responsive grid layout for movies
- Loading states with animations
- Error handling with user feedback

### 3. Search Functionality
- Real-time search with debouncing
- Search by:
  - Movie title
  - Genre
  - Rating
  - Release year
- Results displayed in MovieGrid
- Clear search option

#### Search API Integration
- Endpoint: `https://imdb236.p.rapidapi.com/imdb/search`
- Parameters:
  ```json
  {
    "type": "movie",
    "genre": "Drama",
    "rows": "25",
    "sortOrder": "ASC",
    "sortField": "id"
  }
  ```

### 4. Movie Details Page
- Rich movie information display
- Features:
  - Movie poster and details
  - User reviews section
  - Rating system
  - Watch later button
  - Review submission button
- Responsive layout with grid system

#### Movie Data Integration
- Add Movie: `POST /api/movies/add/`
- Get Movie Details: `GET /api/movies/{movie_id}/`
- Headers: `Authorization: Bearer {token}`

### 5. Review System
- Star rating system (1-5 stars)
- Review text input
- Edit and delete capabilities
- Review listing with pagination
- User-specific review management

#### Review Endpoints
- Create Review: `POST /api/movies/{movie_id}/reviews/create/`
- Update Review: `PUT /api/reviews/{review_id}/`
- Delete Review: `DELETE /api/reviews/{review_id}/`
- Get User Reviews: `GET /api/users/reviews/`

### 6. Watchlist Management
- Add/Remove movies from watchlist
- Watchlist view in profile
- Watch status tracking
- Integration with review system

#### Watchlist Endpoints
- Add to Watchlist: `POST /api/watchlist/add/{movie_id}/`
- Remove from Watchlist: `DELETE /api/watchlist/remove/{movie_id}/`
- Get Watchlist: `GET /api/watchlist/`

### 7. User Profile
- Personal information display
- Review history
- Watchlist management
- Analytics dashboard
- Profile settings

### 8. Analytics Dashboard
- Review statistics
- Watchlist analytics
- Genre preferences
- Rating distribution
- Interactive charts

## Profile Components

### Profile Header
- User avatar and basic info
- Statistics display:
  - Total movies watched
  - Total reviews
  - Average rating
  - Watchlist count
  - Watch later count
- Profile settings access

### Recent Activity
- Review activities
- Watch status updates
- Watchlist additions
- Activity timeline
- Interactive cards with movie details

### Watchlist Management
- Watch Later list
- Watched movies tracking
- Mark as watched functionality
- Movie status toggles
- Grid/List view options

### Review History
- Star rating display
- Review text snippets
- Date tracking
- Movie thumbnails
- Quick access to edit/delete

## UI/UX Features

### Card Components
1. MovieCard
   - Poster display with fallback
   - Rating badge
   - Release date
   - Genre tags
   - Hover effects
   - Loading states

2. ReviewCard
   - Movie thumbnail
   - Star rating visualization
   - Review snippet
   - Date display
   - Interactive hover states

3. ActivityCard
   - Activity type indicator
   - Movie details
   - Timestamp
   - Action buttons

### Loading States
- Skeleton loaders
- Spinner animations
- Progress indicators
- Placeholder content
- Error states

### Navigation
- Smooth transitions
- Loading indicators
- Prefetching
- Back button handling
- Route protection

### Responsive Design
- Mobile-first approach
- Grid layouts
- Flexible cards
- Adaptive typography
- Touch-friendly interactions

### Visual Feedback
- Toast notifications
- Loading spinners
- Success/error states
- Hover effects
- Transition animations

## Data Management

### State Updates
- Optimistic updates
- Error handling
- Loading states
- Cache management
- Data persistence

### API Integration
- Error boundaries
- Retry logic
- Timeout handling
- Data transformation
- Type safety

### Performance
- Image optimization
- Lazy loading
- Code splitting
- Bundle optimization
- Cache strategies

## Development Guidelines

### Code Organization
- Component structure
- File naming
- Import order
- Type definitions
- Documentation

### Testing
- Unit tests
- Integration tests
- E2E tests
- Performance testing
- Accessibility testing

### Deployment
- Build process
- Environment variables
- Asset optimization
- Error tracking
- Analytics

## UI Components

### Core Components
1. MovieCard
   - Poster display
   - Title and basic info
   - Rating display
   - Hover effects
   - Action buttons

2. SearchBar
   - Real-time search
   - Debounced input
   - Clear button
   - Loading state

3. ReviewForm
   - Star rating input
   - Text area
   - Submit button
   - Validation

4. Loading States
   - Skeleton loaders
   - Spinner animations
   - Progress indicators

### Layout Components
1. Header
   - Navigation
   - Search
   - User menu
   - Authentication state

2. Footer
   - Links
   - Copyright
   - Social media

3. Grid Layouts
   - Responsive movie grid
   - Review list
   - Watchlist display

## State Management

### Auth Store
```typescript
interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  logout: () => void;
}
```

### Movie Store
```typescript
interface MovieState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  setMovies: (movies: Movie[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
```

## API Integration

### Base Configuration
```typescript
const API_BASE_URL = 'http://127.0.0.1:8000/api';
const RAPID_API_BASE_URL = 'https://imdb236.p.rapidapi.com/imdb';
```

### Headers
```typescript
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

## Error Handling
- API error responses
- Network errors
- Authentication errors
- Form validation
- User feedback with toast notifications

## Performance Optimizations
- Image lazy loading
- Component memoization
- Debounced search
- Pagination for lists
- Caching strategies

## Security Considerations
- JWT token management
- Protected routes
- Input sanitization
- XSS prevention
- CSRF protection

## Best Practices
- Component composition
- Type safety with TypeScript
- Responsive design
- Accessibility
- Error boundaries
- Loading states
- Form validation
- User feedback

## Scrapbook API Documentation

### Movie Module APIs

#### Get All Movies 
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

#### Get Movie Detail
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

#### Add Movie
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

#### Get Movie Reviews
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

#### Create Review
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

#### Manage Review
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

#### Get User Reviews
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

#### Watch Later APIs

##### Get Watch Later List
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

##### Add to Watch Later
```
POST /watch-later/add/{movie_id}/
```

### Error Responses

#### 400 Bad Request
```json
{
    "rating": ["This field is required."],
    "review_text": ["This field may not be blank."]
}
```

#### 401 Unauthorized
```json
{
    "detail": "Authentication credentials were not provided."
}
```

#### 404 Not Found
```json
{
    "detail": "Not found."
}
```

### Authentication

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

### Pagination

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

### Common Query Parameters

- `page`: Page number for paginated results
- `search`: Search term for filtering results
- `sort`: Sort field (e.g., 'release_date', '-rating' for descending)
- 
