from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Movie, Review, WatchLater
from .serializers import MovieSerializer, ReviewSerializer, WatchLaterSerializer
from django.db import models

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
def get_watchlist(request):
    watchlist = WatchLater.objects.filter(user=request.user)
    serializer = WatchLaterSerializer(watchlist, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_watchlist(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    watchlater, created = WatchLater.objects.get_or_create(user=request.user, movie=movie)
    if created:
        serializer = WatchLaterSerializer(watchlater)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response({'message': 'Movie already in watchlist'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_watchlist(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    watchlater = get_object_or_404(WatchLater, user=request.user, movie=movie)
    watchlater.delete()
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
def get_user_watchlist(request):
    watchlist = WatchLater.objects.filter(user=request.user)
    serializer = WatchLaterSerializer(watchlist, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_movie(request):
    serializer = MovieSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


