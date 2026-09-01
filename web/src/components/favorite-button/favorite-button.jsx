
function FavoriteButton({ recipeId }) {
    

  return (
    <button className="favorite-button" onClick={() => handleFavoriteClick(recipeId)}>
      <span className="favorite-button__icon">❤️</span>
      <span className="favorite-button__text">Add to Favorites</span>
    </button>
  );
}

export default FavoriteButton;