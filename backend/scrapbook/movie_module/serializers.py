from rest_framework import serializers
from .models import Movie, Review, WatchLater, Watchlist
import json

class MovieSerializer(serializers.ModelSerializer):
    genres = serializers.SerializerMethodField()
    
    class Meta:
        model = Movie
        fields = '__all__'
    
    def get_genres(self, obj):
        if obj.genres is None:
            return []
        
        # If genres is already a list, return it
        if isinstance(obj.genres, list):
            return obj.genres
        
        # If genres is a string, try to parse it as JSON
        if isinstance(obj.genres, str):
            try:
                return json.loads(obj.genres)
            except json.JSONDecodeError:
                return [obj.genres]
        
        # If genres is something else, convert to string and return as list
        return [str(obj.genres)]
    
    def to_internal_value(self, data):
        # Ensure genres is a list before saving
        if 'genres' in data:
            genres = data['genres']
            if isinstance(genres, str):
                try:
                    data['genres'] = json.loads(genres)
                except json.JSONDecodeError:
                    data['genres'] = [genres]
            elif not isinstance(genres, list):
                data['genres'] = [str(genres)]
        return super().to_internal_value(data)

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    
    class Meta:
        model = Review
        fields = ['id', 'user', 'movie', 'rating', 'review_text', 'created_at']

class WatchLaterSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = WatchLater
        fields = ['id', 'user', 'movie', 'added_at']

class WatchlistSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Watchlist
        fields = ['id', 'user', 'movie', 'watched_at']
