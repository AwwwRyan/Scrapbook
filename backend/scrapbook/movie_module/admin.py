from django.contrib import admin
from .models import Movie, Review, WatchLater


admin.site.register(Movie)
admin.site.register(Review)
admin.site.register(WatchLater)