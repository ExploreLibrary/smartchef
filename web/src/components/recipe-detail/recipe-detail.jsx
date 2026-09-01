import FavoriteButton from "../favorite-button/favorite-button";

function RecipeDetail({ recipeData }) {
  const recipe = recipeData ?? {};

  return (
    <div className="main-content main-content-recipe-detail">
      <div className="recipe-detail__header">
        <div className="recipe-detail__header-info">
          <h2>Recipe: {recipe.strMeal ?? "Receta sin definir"}</h2>
          <p>Recipe ID: {recipe.idMeal ?? "N/A"}</p>
        </div>
        <div className="recipe-detail__header-actions">
          <FavoriteButton recipeId={recipe.idMeal} />
        </div>
      </div>
      <div className="recipe-detail__image-outer-container">
      {recipe.strMealThumb && (
        
          <div className="recipe-detail__image-container">
            <img src={recipe.strMealThumb} alt={recipe.strMeal} />
          </div>
      )}
      </div>
      <p>Country: {recipe.strCountry ?? "Country not specified"}</p>
      <h2>Instructions</h2>
      <p className="recipe-detail__instructions">
        {recipe.strInstructions ?? "Instructions not available"}
      </p>
    </div>
  );
}

export default RecipeDetail;

