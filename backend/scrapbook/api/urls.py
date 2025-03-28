from authentication.views import *
from movie_module.views import *
from django.urls import path
from django.contrib import admin

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Authentication URLs
    path('users/profile/', fetch_user_details, name='fetch_user_details'),
    path('users/create/', create_user, name='create_user'),
    path('users/login/', login_user, name='login_user'),
    path('users/logout/', logout_user, name='logout_user'), 
    path('users/reset_password/', reset_password, name='reset_password'),
    path('users/edit_user/', edit_user_details, name='edit_user_details'),
    path('users/delete/', delete_user, name='delete_user'), 
    
    # Movie URLs
    path('movies/', get_all_movies, name='get_all_movies'),
    path('movies/add/', add_movie, name='add_movie'),
    path('movies/<str:movie_id>/', get_movie_detail, name='get_movie_detail'),
    
    # Review URLs
    path('movies/<str:movie_id>/reviews/', get_movie_reviews, name='get_movie_reviews'),
    path('movies/<str:movie_id>/reviews/create/', create_review, name='create_review'),
    path('reviews/<int:review_id>/', manage_review, name='manage_review'),
    path('users/reviews/', get_user_reviews, name='get_user_reviews'),
    
    # Watch Later URLs
    path('watch-later/', get_watch_later, name='get_watch_later'),
    path('watch-later/add/<str:movie_id>/', add_to_watch_later, name='add_to_watch_later'),
    path('watch-later/remove/<str:movie_id>/', remove_from_watch_later, name='remove_from_watch_later'),
    path('users/watch-later/', get_user_watch_later, name='get_user_watch_later'),
    
    # Watchlist URLs (for watched movies)
    path('watchlist/', get_watchlist, name='get_watchlist'),
    path('watchlist/add/<str:movie_id>/', add_to_watchlist, name='add_to_watchlist'),
    path('watchlist/remove/<str:movie_id>/', remove_from_watchlist, name='remove_from_watchlist'),
    path('users/watchlist/', get_user_watchlist, name='get_user_watchlist'),
    
    # Analytics URLs
    path('users/statistics/', get_user_statistics, name='get_user_statistics'),
    path('users/recent-activity/', get_recent_activity, name='get_recent_activity'),
    path('users/analytics/genres/', get_genre_analytics, name='get_genre_analytics'),
    path('users/analytics/ratings/', get_rating_analytics, name='get_rating_analytics'),
    path('users/analytics/watch-history/', get_watch_history, name='get_watch_history'),
    path('users/analytics/highlights/', get_user_highlights, name='get_user_highlights'),
]
