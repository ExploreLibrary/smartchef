function RecipeDetail({ recipeData }) {
  const recipe = recipeData ?? {};

  return (
    <div className="main-content main-content-recipe-detail">
      <h2>Recipe: {recipe.strMeal ?? "Receta sin definir"}</h2>
      <p>Recipe ID: {recipe.idMeal ?? "N/A"}</p>
      {recipe.strMealThumb && (
        <div className="recipe-detail__image-container">
          <img src={recipe.strMealThumb} alt={recipe.strMeal} />
        </div>
      )}
      <p>Country: {recipe.strCountry ?? "Country not specified"}</p>
      <h2>Instructions</h2>
      <p className="recipe-detail__instructions">
        {recipe.strInstructions ?? "Instructions not available"}
      </p>
    </div>
  );
}

export default RecipeDetail;

