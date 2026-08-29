function RecipeDetail({ recipeData }) {
  const recipe = recipeData ?? {};

  return (
    <div>
      <h2>Detalle de la receta</h2>
      <p>Recipe ID: {recipe.idMeal ?? "N/A"}</p>
      <p>Título: {recipe.strMeal ?? "Sin título"}</p>
      <p>País: {recipe.strCountry ?? "País no especificado"}</p>
      {recipe.strMealThumb && (
        <img src={recipe.strMealThumb} alt={recipe.strMeal} style={{ maxWidth: "300px" }} />
       )}
       <h2>Instrucciones de la receta</h2>
       <p>{recipe.strInstructions ?? "Instrucciones no disponibles"}</p>
    </div>
  );
}

export default RecipeDetail;

