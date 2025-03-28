from django.db import models
from django.contrib.auth import get_user_model

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


User = get_user_model()

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

class WatchLater(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="watch_later")
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="watch_later")
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'movie')  # Avoid duplicate watch later entries

    def __str__(self):
        return f"{self.user.name} wants to watch {self.movie.title}"

class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="watchlist")
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="watchlist")
    watched_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'movie')  # Avoid duplicate entries

    def __str__(self):
        return f"{self.user.name} has watched {self.movie.title}"
