# Scrapbook - Movie Review & Recommendation App

A collaborative platform for movie enthusiasts to log, review, and discuss films.

## Frontend 
- Built with Next.js + React
- UI powered by ShadCN UI for modular and aesthetic components

## Project Structure
```
src
├── app
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login
│   │   ├── page.tsx
│   ├── profile
│   │   ├── page.tsx
│   │   ├── edit
│   │   │   ├── page.tsx
│   ├── register
│   │   ├── page.tsx
│   ├── watchlist
│   │   ├── page.tsx
├── components
│   ├── Navbar.tsx
│   ├── MovieCard.tsx
│   ├── SearchBar.tsx
├── lib
│   ├── api.ts
│   ├── utils.ts
├── styles
│   ├── globals.css
│   ├── theme.css
```

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

## Application Flow

### 1. Homepage
- No authentication required
- Displays movies fetched from RapidAPI's IMDb API
- Features:
  - Shows popular movies
  - Recommended movies
  - Movies by genre
- Lazy loading for better performance
- Uses ShadCN's Card component for movie display

#### API Endpoints for Homepage

1. Popular Movies
- URL: `https://imdb236.p.rapidapi.com/imdb/most-popular-movies`
- Headers:
  ```
  {
    "x-rapidapi-key": "",
    "x-rapidapi-host": "imdb236.p.rapidapi.com"
  }
  ```

2. Top Movies
- URL: `https://imdb236.p.rapidapi.com/imdb/top-box-office`
- Headers: Same as above

3. Top Indian Movies
- URL: `https://imdb236.p.rapidapi.com/imdb/india/top-rated-indian-movies`
- Headers: Same as above

4. Upcoming Indian Movies
- URL: `https://imdb236.p.rapidapi.com/imdb/india/upcoming`
- Headers: Same as above

### 2. Search Functionality
- Search movies on homepage
- Click on movie opens detailed movie page

#### Search API
- URL: `https://imdb236.p.rapidapi.com/imdb/search`
- Query Parameters:
  ```json
  {
    "type": "movie",
    "genre": "Drama",
    "rows": "25",
    "sortOrder": "ASC",
    "sortField": "id"
  }
  ```
- Supports various search parameters like title, genre, rating, etc.

### 3. Movie Page
- No authentication required
- Displays movie details
- "Add Review" button to redirect to review page

#### Add Movie to Database
- URL: `http://127.0.0.1:8000/api/movies/add/`
- Method: POST
- Header: `Authorization: Bearer access_token`
- Sample Request Body:
  ```json
  {
    "id": "tt1234567",
    "title": "Example Movie",
    "description": "Optional description",
    "image_url": "https://example.com/image.jpg",
    "release_date": "2024-02-25",
    "start_year": 2024,
    "end_year": null,
    "runtime_minutes": 120,
    "genres": ["Action", "Drama"],
    "language": "English",
    "countries": ["USA", "UK"],
    "rating": 8.5,
    "num_votes": 1000,
    "budget": 1000000,
    "gross_worldwide": 5000000,
    "is_adult": false
  }
  ```

### 4. Review Page
- Add reviews for a specific movie
- URL: `http://127.0.0.1:8000/api/movies/<movie_id>/reviews/create/`
- Method: POST
- Header: `Authorization: Bearer access_token`
- Sample Request Body:
  ```json
  {
    "rating": 5.0,
    "review_text": "Updated review: Amazing movie!"
  }
  ```

### 5. My Reviews Page
- Fetch user's reviewed movies
- URL: `http://127.0.0.1:8000/api/users/reviews/`
- Header: `Authorization: Bearer access_token`

#### Editing and Deleting Reviews
- URL: `http://127.0.0.1:8000/api/reviews/1/`
- Methods: PUT (edit), DELETE
- Header: `Authorization: Bearer access_token`
- Sample Request Body for PUT:
  ```json
  {
    "rating": 5.0,
    "review_text": "Updated review: Amazing movie!"
  }
  ```