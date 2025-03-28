export const movieApi = {
  // ... other methods ...
  
  addReview: async (movieId: string, data: { review_text: string; rating: number }) => {
    const response = await fetch(`http://127.0.0.1:8000/api/movies/${movieId}/reviews/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // Or however you store your access token
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw await response.json();
    }
    
    return response.json();
  }
}; 