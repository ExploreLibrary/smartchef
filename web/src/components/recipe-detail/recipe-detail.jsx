import FavoriteButton from "../favorite-button/favorite-button";
import Rating from "../rating/rating";

function RecipeDetail({ recipeData, onCheckPantry, pantryCheck, pantryLoading, pantryError }) {
  const recipe = recipeData ?? {};

  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure?.trim() || "",
      });
    }
  }

  return (
    <div className="main-content main-content-recipe-detail">

      {/* HEADER */}
      <div className="recipe-detail__header">
        <div className="recipe-detail__header-info">
          <h2>
            Recipe: {recipe.strMeal ?? "Receta sin definir"}
          </h2>

          <p>
            Recipe ID: {recipe.idMeal ?? "N/A"}
          </p>
        </div>

        <div className="recipe-detail__header-actions">
          <FavoriteButton
            recipeId={recipe.idMeal}
            recipeName={recipe.strMeal}
            recipeThumb={recipe.strMealThumb}
          />
        </div>
      </div>

      {/* IMAGE */}
      <div className="recipe-detail__image-outer-container">
        {recipe.strMealThumb && (
          <div className="recipe-detail__image-container">
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
            />
          </div>
        )}
      </div>

      {/* BASIC INFORMATION */}
      <div className="recipe-detail__info">
        <p>
          Country:{" "}
          {recipe.strArea ?? "Country not specified"}
        </p>

        {recipe.strCategory && (
          <p>
            Category: {recipe.strCategory}
          </p>
        )}
      </div>

      {/* INSTRUCTIONS */}
      <section className="recipe-detail__instructions">
        <h2>Instructions</h2>

        <p>
          {recipe.strInstructions ??
            "Instructions not available"}
        </p>
      </section>

      {/* INGREDIENTS */}
      <section className="recipe-detail__ingredients">
        <h2>Ingredients</h2>

        {ingredients.length === 0 ? (
          <p>Ingredients not available.</p>
        ) : (
          <ul className="recipe-detail__ingredients-list">
            {ingredients.map((item, index) => (
              <li
                key={`${item.ingredient}-${index}`}
                className="recipe-detail__ingredient"
              >
                <span className="recipe-detail__ingredient-measure">
                  {item.measure}
                </span>

                <span>
                  {item.ingredient}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* YOUTUBE */}
      {recipe.strYoutube && (
        <section className="recipe-detail__youtube">
          <h2>Video</h2>

          <a
            className="recipe-detail__youtube-link"
            href={recipe.strYoutube}
            target="_blank"
            rel="noreferrer"
          >
            Watch on YouTube
          </a>
        </section>
      )}

      <Rating mealId={recipe.idMeal} />

      {/* CHECK PANTRY */}
      <section className="recipe-detail__pantry">
        <button
          className="recipe-detail__pantry-button"
          type="button"
          onClick={onCheckPantry}
          disabled={pantryLoading}
        >
          {pantryLoading
            ? "Checking pantry..."
            : "Check my pantry"}
        </button>

        {pantryError && (
          <p className="recipe-detail__pantry-error">
            Unable to check your pantry.
          </p>
        )}

        {pantryCheck && (
          <div className="recipe-detail__pantry-results">

            {/* AVAILABLE */}
            <div className="recipe-detail__pantry-column">
              <h2>Available</h2>

              {pantryCheck.available?.length === 0 ? (
                <p>
                  You don't have any of the required
                  ingredients.
                </p>
              ) : (
                <ul>
                  {pantryCheck.available.map(
                    (ingredient, index) => (
                      <li
                        key={`${ingredient}-${index}`}
                      >
                        {ingredient}
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>

            {/* MISSING */}
            <div className="recipe-detail__pantry-column">
              <h2>Missing</h2>

              {pantryCheck.missing?.length === 0 ? (
                <p>
                  You have all the required ingredients!
                </p>
              ) : (
                <ul>
                  {pantryCheck.missing.map(
                    (ingredient, index) => (
                      <li
                        key={`${ingredient}-${index}`}
                      >
                        {ingredient}
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
            
          </div>
        )}
      </section>

    </div>
  );
}

export default RecipeDetail;