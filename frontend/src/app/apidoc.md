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
    "description": "Movie description",
    "image_url": "https://example.com/image.jpg",
    "release_date": "2024-03-28",
    "genres": ["Action", "Drama"],
    "rating": 4.5,
    "runtime_minutes": 120
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
    "rating": 4.5,
    "review_text": "Great movie!"
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
        "movie": "tt1234567",
        "added_at": "2024-03-28T10:30:00Z"
    }
]
```

#### Add to Watch Later
```
POST /watch-later/add/{movie_id}/
```
**Headers:**
- Authorization: Bearer {token}

**Response:**
```json
{
    "id": 1,
    "user": "username",
    "movie": "tt1234567",
    "added_at": "2024-03-28T10:30:00Z"
}
```

#### Remove from Watch Later
```
DELETE /watch-later/remove/{movie_id}/
```
**Headers:**
- Authorization: Bearer {token}

**Response:**
- Status: 204 No Content

#### Get User Watch Later List
```
GET /users/watch-later/
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
        "added_at": "2024-03-28T10:30:00Z"
    }
]
```

### Watchlist APIs (Watched Movies)

#### Get Watchlist
```
GET /watchlist/
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
        "watched_at": "2024-03-28T10:30:00Z"
    }
]
```

#### Add to Watchlist
```
POST /watchlist/add/{movie_id}/
```
**Headers:**
- Authorization: Bearer {token}

**Response:**
```json
{
    "id": 1,
    "user": "username",
    "movie": "tt1234567",
    "watched_at": "2024-03-28T10:30:00Z"
}
```

#### Remove from Watchlist
```
DELETE /watchlist/remove/{movie_id}/
```
**Headers:**
- Authorization: Bearer {token}

**Response:**
- Status: 204 No Content

#### Get User Watchlist
```
GET /users/watchlist/
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
        "watched_at": "2024-03-28T10:30:00Z"
    }
]
```

## Notes:
- All authenticated endpoints require a valid JWT token in the Authorization header
- All dates are in ISO 8601 format
- Movie IDs are IMDB IDs (starting with 'tt')
- Review ratings are on a scale of 0 to 5
- All responses include HTTP status codes indicating success or failure
```

This documentation provides:
1. All endpoints in the movie module
2. Required headers for each endpoint
3. Sample request bodies where applicable
4. Sample responses
5. Notes about authentication and data formats
