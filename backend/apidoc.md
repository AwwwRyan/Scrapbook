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

</rewritten_file>