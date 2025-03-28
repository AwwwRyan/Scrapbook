from django.contrib import admin
from .models import Movie, Review, WatchLater, Watchlist


admin.site.register(Movie)
admin.site.register(Review)
admin.site.register(WatchLater)
admin.site.register(Watchlist)
