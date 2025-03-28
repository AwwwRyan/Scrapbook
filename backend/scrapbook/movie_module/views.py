from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Movie, Review, WatchLater, Watchlist
from .serializers import (MovieSerializer, ReviewSerializer, 
                         WatchLaterSerializer, WatchlistSerializer)
from django.db import models
from django.db.models import Avg, Count, Q
from django.utils import timezone
from datetime import timedelta
from collections import defaultdict
from django.core.cache import cache
from rest_framework.exceptions import ValidationError
import json

@api_view(['GET'])
def get_all_movies(request):
    movies = Movie.objects.all()
    serializer = MovieSerializer(movies, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_movie_detail(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    serializer = MovieSerializer(movie)
    return Response(serializer.data)


# Review related views
@api_view(['GET'])
def get_movie_reviews(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    reviews = Review.objects.filter(movie=movie)
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    # Create a mutable copy of request.data
    data = request.data.copy()
    # Add the movie ID to the data
    data['movie'] = movie_id
    
    serializer = ReviewSerializer(data=data)
    if serializer.is_valid():
        serializer.save(user=request.user, movie=movie)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_review(request, review_id):
    review = get_object_or_404(Review, id=review_id, user=request.user)
    if request.method == 'PUT':
        serializer = ReviewSerializer(review, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Watch Later related views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_watch_later(request):
    watch_later = WatchLater.objects.filter(user=request.user)
    serializer = WatchLaterSerializer(watch_later, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_watch_later(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    watch_later, created = WatchLater.objects.get_or_create(user=request.user, movie=movie)
    if created:
        serializer = WatchLaterSerializer(watch_later)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response({'message': 'Movie already in watch later'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_watch_later(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    watch_later = get_object_or_404(WatchLater, user=request.user, movie=movie)
    watch_later.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

# User's movie-related views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_reviews(request):
    reviews = Review.objects.filter(user=request.user)
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_watch_later(request):
    watch_later = WatchLater.objects.filter(user=request.user)
    serializer = WatchLaterSerializer(watch_later, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_movie(request):
    serializer = MovieSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Watchlist related views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_watchlist(request):
    watchlist = Watchlist.objects.filter(user=request.user)
    serializer = WatchlistSerializer(watchlist, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_watchlist(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    watchlist, created = Watchlist.objects.get_or_create(user=request.user, movie=movie)
    if created:
        serializer = WatchlistSerializer(watchlist)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response({'message': 'Movie already in watchlist'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_watchlist(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    watchlist = get_object_or_404(Watchlist, user=request.user, movie=movie)
    watchlist.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_watchlist(request):
    watchlist = Watchlist.objects.filter(user=request.user)
    serializer = WatchlistSerializer(watchlist, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_statistics(request):
    cache_key = f'user_stats_{request.user.id}'
    cached_data = cache.get(cache_key)
    
    if cached_data:
        return Response(cached_data)
        
    user = request.user
    
    # Get counts and averages
    watched_movies = Watchlist.objects.filter(user=user)
    reviews = Review.objects.filter(user=user)
    watch_later = WatchLater.objects.filter(user=user)
    
    # Calculate genre statistics
    genres_watched = set()
    genre_counts = defaultdict(int)
    
    for watch in watched_movies:
        if watch.movie.genres:
            for genre in watch.movie.genres:
                genres_watched.add(genre)
                genre_counts[genre] += 1
    
    most_watched = max(genre_counts.items(), key=lambda x: x[1])[0] if genre_counts else None
    
    # Calculate review completion rate
    total_watched = watched_movies.count()
    total_reviewed = reviews.count()
    completion_rate = (total_reviewed / total_watched * 100) if total_watched > 0 else 0
    
    response_data = {
        "total_movies_watched": total_watched,
        "total_reviews": total_reviewed,
        "average_rating": reviews.aggregate(Avg('rating'))['rating__avg'] or 0,
        "watchlist_count": watched_movies.count(),
        "watch_later_count": watch_later.count(),
        "total_genres_watched": len(genres_watched),
        "most_watched_genre": most_watched,
        "review_completion_rate": round(completion_rate, 1)
    }
    
    cache.set(cache_key, response_data, timeout=3600)  # Cache for 1 hour
    return Response(response_data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recent_activity(request):
    user = request.user
    
    # Combine different activities
    activities = []
    
    # Add reviews
    reviews = Review.objects.filter(user=user).select_related('movie')
    for review in reviews:
        activities.append({
            "type": "review",
            "movie": {
                "id": review.movie.id,
                "title": review.movie.title,
                "image_url": review.movie.image_url
            },
            "action_date": review.created_at,
            "details": {
                "rating": review.rating,
                "review_snippet": review.review_text[:100] if review.review_text else None
            }
        })
    
    # Add watches
    watches = Watchlist.objects.filter(user=user).select_related('movie')
    for watch in watches:
        activities.append({
            "type": "watch",
            "movie": {
                "id": watch.movie.id,
                "title": watch.movie.title,
                "image_url": watch.movie.image_url
            },
            "action_date": watch.watched_at,
            "details": {}
        })
    
    # Sort by date
    activities.sort(key=lambda x: x['action_date'], reverse=True)
    
    return Response({
        "activities": activities,
        "total_activities": len(activities)
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_genre_analytics(request):
    user = request.user
    
    # Debug print
    print(f"User: {user.username}")
    
    # Get all watched movies with their genres and reviews
    watched_movies = Watchlist.objects.filter(user=user).select_related('movie')
    print(f"Total watched movies: {watched_movies.count()}")
    
    # Initialize counters
    genre_distribution = defaultdict(int)
    genre_ratings = defaultdict(list)
    
    for watch in watched_movies:
        # Debug print
        print(f"Movie: {watch.movie.title}, Genres: {watch.movie.genres}")
        
        if watch.movie.genres:  # Check if genres exist
            # Handle both string and list formats
            genres = watch.movie.genres
            if isinstance(genres, str):
                try:
                    genres = json.loads(genres)
                except json.JSONDecodeError:
                    genres = [genres]
            elif not isinstance(genres, list):
                genres = [str(genres)]
            
            for genre in genres:
                genre_distribution[genre] += 1
                
                # Get rating if exists
                review = Review.objects.filter(user=user, movie=watch.movie).first()
                if review:
                    print(f"Found review with rating: {review.rating}")
                    genre_ratings[genre].append(review.rating)
    
    print(f"Genre distribution: {dict(genre_distribution)}")
    print(f"Genre ratings: {dict(genre_ratings)}")
    
    # Calculate favorite genres
    favorite_genres = []
    for genre, count in genre_distribution.items():
        avg_rating = None
        if genre_ratings[genre]:
            avg_rating = sum(genre_ratings[genre]) / len(genre_ratings[genre])
        
        favorite_genres.append({
            "genre": genre,
            "movie_count": count,
            "average_rating": round(avg_rating, 1) if avg_rating is not None else None
        })
    
    # Calculate trending genres (last 30 days)
    thirty_days_ago = timezone.now() - timedelta(days=30)
    recent_watches = Watchlist.objects.filter(
        user=user,
        watched_at__gte=thirty_days_ago
    ).select_related('movie')
    
    trending = defaultdict(int)
    for watch in recent_watches:
        if watch.movie.genres:
            genres = watch.movie.genres
            if isinstance(genres, str):
                try:
                    genres = json.loads(genres)
                except json.JSONDecodeError:
                    genres = [genres]
            elif not isinstance(genres, list):
                genres = [str(genres)]
                
            for genre in genres:
                trending[genre] += 1
    
    trending_genres = [
        {
            "genre": genre,
            "recent_watches": count,
            "last_30_days": True
        }
        for genre, count in trending.items()
    ]
    
    response_data = {
        "distribution": dict(genre_distribution),
        "favorite_genres": sorted(favorite_genres, key=lambda x: x['movie_count'], reverse=True),
        "trending_genres": sorted(trending_genres, key=lambda x: x['recent_watches'], reverse=True)
    }
    
    print(f"Final response: {response_data}")
    
    return Response(response_data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_rating_analytics(request):
    user = request.user
    
    # Get all user reviews
    reviews = Review.objects.filter(user=user).select_related('movie')
    
    # Calculate rating distribution
    distribution = {
        '5_stars': 0,
        '4_stars': 0,
        '3_stars': 0,
        '2_stars': 0,
        '1_star': 0
    }
    
    for review in reviews:
        rating = int(round(review.rating))
        if rating == 5:
            distribution['5_stars'] += 1
        elif rating == 4:
            distribution['4_stars'] += 1
        elif rating == 3:
            distribution['3_stars'] += 1
        elif rating == 2:
            distribution['2_stars'] += 1
        else:
            distribution['1_star'] += 1
    
    # Calculate average by genre
    genre_ratings = defaultdict(list)
    for review in reviews:
        if review.movie.genres:
            for genre in review.movie.genres:
                genre_ratings[genre].append(review.rating)
    
    average_by_genre = {
        genre: round(sum(ratings)/len(ratings), 1)
        for genre, ratings in genre_ratings.items()
    }
    
    # Calculate rating trends
    thirty_days_ago = timezone.now() - timedelta(days=30)
    sixty_days_ago = timezone.now() - timedelta(days=60)
    
    recent_ratings = reviews.filter(created_at__gte=thirty_days_ago)
    previous_ratings = reviews.filter(
        created_at__gte=sixty_days_ago,
        created_at__lt=thirty_days_ago
    )
    
    recent_avg = recent_ratings.aggregate(Avg('rating'))['rating__avg'] or 0
    previous_avg = previous_ratings.aggregate(Avg('rating'))['rating__avg'] or 0
    
    trend = "increasing" if recent_avg > previous_avg else "decreasing" if recent_avg < previous_avg else "stable"
    
    return Response({
        "distribution": distribution,
        "average_by_genre": average_by_genre,
        "rating_trends": {
            "last_30_days": round(recent_avg, 1),
            "previous_30_days": round(previous_avg, 1),
            "trend": trend
        }
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_watch_history(request):
    try:
        timeframe = request.GET.get('timeframe', 'month')
        if timeframe not in ['week', 'month', 'year']:
            raise ValidationError({'timeframe': 'Invalid timeframe parameter'})
            
        user = request.user
        
        # Calculate date range based on timeframe
        end_date = timezone.now()
        if timeframe == 'week':
            start_date = end_date - timedelta(days=7)
        elif timeframe == 'year':
            start_date = end_date - timedelta(days=365)
        else:  # month
            start_date = end_date - timedelta(days=30)
        
        # Get watches within timeframe
        watches = Watchlist.objects.filter(
            user=user,
            watched_at__gte=start_date,
            watched_at__lte=end_date
        ).select_related('movie')
        
        # Group watches by date
        timeline = defaultdict(list)
        total_runtime = 0
        
        for watch in watches:
            date_str = watch.watched_at.date().isoformat()
            review = Review.objects.filter(user=user, movie=watch.movie).first()
            
            movie_data = {
                "id": watch.movie.id,
                "title": watch.movie.title,
                "rating": review.rating if review else None
            }
            
            timeline[date_str].append(movie_data)
            total_runtime += watch.movie.runtime_minutes or 0
        
        # Calculate daily average
        days_in_range = (end_date - start_date).days or 1
        daily_average = len(watches) / days_in_range
        
        # Find most active day
        day_counts = defaultdict(int)
        for watch in watches:
            day_name = watch.watched_at.strftime('%A')
            day_counts[day_name] += 1
        
        most_active_day = max(day_counts.items(), key=lambda x: x[1])[0] if day_counts else None
        
        return Response({
            "timeline": [
                {
                    "date": date,
                    "movies_watched": len(movies),
                    "movies": movies
                }
                for date, movies in timeline.items()
            ],
            "summary": {
                "daily_average": round(daily_average, 1),
                "most_active_day": most_active_day,
                "total_watch_time": total_runtime
            }
        })
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_highlights(request):
    user = request.user
    
    # Get top rated movies
    top_rated = Review.objects.filter(user=user)\
        .select_related('movie')\
        .order_by('-rating')[:5]
    
    top_rated_movies = [
        {
            "id": review.movie.id,
            "title": review.movie.title,
            "rating": review.rating,
            "review_date": review.created_at
        }
        for review in top_rated
    ]
    
    # Get longest movies watched
    longest_movies = Watchlist.objects.filter(user=user)\
        .select_related('movie')\
        .order_by('-movie__runtime_minutes')[:5]
    
    longest_movies_data = [
        {
            "id": watch.movie.id,
            "title": watch.movie.title,
            "runtime_minutes": watch.movie.runtime_minutes
        }
        for watch in longest_movies
        if watch.movie.runtime_minutes  # Only include movies with runtime data
    ]
    
    # Calculate watching streak
    watches = Watchlist.objects.filter(user=user)\
        .order_by('watched_at')
    
    current_streak = 0
    longest_streak = 0
    current_date = timezone.now().date()
    
    # Get unique dates of watches
    watch_dates = set(watch.watched_at.date() for watch in watches)
    total_active_days = len(watch_dates)
    
    # Calculate streaks
    if watch_dates:
        current_streak = 0
        for i in range(30):  # Check last 30 days
            check_date = current_date - timedelta(days=i)
            if check_date in watch_dates:
                current_streak += 1
            else:
                break
        
        # Calculate longest streak
        longest_streak = 0
        temp_streak = 0
        sorted_dates = sorted(watch_dates)
        for i in range(len(sorted_dates)):
            if i > 0 and (sorted_dates[i] - sorted_dates[i-1]).days == 1:
                temp_streak += 1
            else:
                temp_streak = 1
            longest_streak = max(longest_streak, temp_streak)
    
    return Response({
        "top_rated_movies": top_rated_movies,
        "longest_movies_watched": longest_movies_data,
        "watching_streak": {
            "current_streak": current_streak,
            "longest_streak": longest_streak,
            "total_active_days": total_active_days
        }
    })


