# Scrapbook - Movie Review & Recommendation App

A collaborative platform for movie enthusiasts to log, review, and discuss films.

## 1. Project Overview

### Frontend
- Built with Next.js + React
- UI powered by ShadCN UI for modular and aesthetic components
- Uses Socket.IO for real-time chat
- Communicates with the Django backend via REST APIs

### Backend
- Django REST framework to handle API endpoints
- Uses RapidAPI IMDb API for fetching movie details
- Recommendation system stores and retrieves recommended movies from the database

## 2. Project Folder Structure

```
scrapbook-frontend/
│── public/                 # Static assets (SVGs, images, etc.)
│── src/
│   ├── app/                # Next.js main pages
│   │   ├── layout.tsx      # Global layout wrapper
│   │   ├── page.tsx        # Homepage
│   │   ├── chat.tsx        # Chat page
│   │   ├── search.tsx      # Search page
│   │   ├── watchlist.tsx   # Watchlist page
│   │   ├── reviews.tsx     # Movie logging & reviews page
│   ├── components/         # Reusable UI components
│   │   ├── MovieCard.tsx   # Displays movie details
│   │   ├── ChatBox.tsx     # Chat UI
│   │   ├── SearchBar.tsx   # Search input
│   │   ├── WatchlistItem.tsx # Watchlist UI
│   │   ├── ReviewForm.tsx  # Movie review form
│   ├── ui/                 # ShadCN UI components
│   │   ├── index.ts        # Barrel file exporting all UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── textarea.tsx
│   │   ├── toggle.tsx
│   ├── lib/                # Utility functions & API calls
│   │   ├── api.ts          # API requests (Axios)
│   │   ├── utils.ts        # Helper functions
│   ├── styles/             # Global styles
│   │   ├── globals.css     # Tailwind & global styles
│   ├── types/              # TypeScript types
│   │   ├── index.ts        # Centralized types
│── .env                    # API keys & environment variables
│── next.config.js          # Next.js config
│── package.json            # Dependencies
│── tsconfig.json           # TypeScript config
```

## 3. Features & Implementation Details

### 3.1 Homepage

The homepage displays movies fetched from RapidAPI's IMDb API.

#### Features
- Shows popular movies, recommended movies, and movies by genre
- Lazy loading for better performance
- Uses ShadCN's Card component for movie display

#### API Call for Fetching Movies

```javascript
const fetchMovies = async () => {
    const response = await axios.get(`${API_BASE_URL}/movies`);
    return response.data;
};
```

### 3.2 Chat Functionality

Users can share reviews and discuss movies in real time.

#### Features
- Private messaging system
- Real-time updates using Socket.IO
- Users can search and add friends

#### Socket.IO Event Example

Client-side:
```javascript
socket.emit("sendMessage", {
    sender: "user123",
    receiver: "user456",
    message: "Have you watched Inception?"
});
```

Server Response:
```json
{
    "status": "success",
    "message": "Message delivered"
}
```

### 3.3 Search Functionality

Users can search for movies and friends.

#### Features
- Uses RapidAPI IMDb API for movies
- Search results display in a list format

#### API Call Example
```javascript
const searchMovies = async (query) => {
    const response = await axios.get(`https://imdb236.p.rapidapi.com/imdb/search?${query}`);
    return response.data;
};
```

### 3.4 Movie Logging & Reviews Page

Users can log watched movies and write reviews.

#### Features
- Star-based rating system (1-5 stars)
- Reviews are editable & deletable
- Users can view their past reviews

### 3.5 Watchlist Management

Users can add movies to their watchlist and mark them as watched.

#### Features
- Toggle button for marking as watched/unwatched
- Badge component to show watchlist status

#### API Call for Watchlist Actions

Request (Add to Watchlist):
```javascript
const addToWatchlist = async (movieId) => {
    const response = await axios.post(`${API_BASE_URL}/watchlist`, { movie_id: movieId });
    return response.data;
};
```

Response:
```json
{
    "status": "success",
    "message": "Movie added to watchlist"
}
```