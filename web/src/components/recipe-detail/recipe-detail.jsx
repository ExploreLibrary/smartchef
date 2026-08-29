function RecipeDetail({ recipeData }) {
    {console.log("RecipeDetail", recipeData)}
    
  return (
    <div>
      <h2>Detalle de la receta</h2>
      <p>Recipe ID: {recipeData}</p>

    </div>
  );
}

export default RecipeDetail;
