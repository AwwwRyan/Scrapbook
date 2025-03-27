from rest_framework import serializers
from .models import Movie, Review, WatchLater

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'

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
