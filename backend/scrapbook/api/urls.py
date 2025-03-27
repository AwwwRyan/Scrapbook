from authentication.views import *
from movie_module.views import *
from django.urls import path
from django.contrib import admin

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Authentication URLs
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
    path('watchlist/', get_watchlist, name='get_watchlist'),
    path('watchlist/add/<str:movie_id>/', add_to_watchlist, name='add_to_watchlist'),
    path('watchlist/remove/<str:movie_id>/', remove_from_watchlist, name='remove_from_watchlist'),
    path('users/watchlist/', get_user_watchlist, name='get_user_watchlist'),
]
