import { useEffect, useState } from "react";
import { PageLayout } from "../layouts";
import { getRecipeAreas, searchRecipes } from "../services/api-service";
import { Link } from "react-router-dom";

const countryLabels = {
  American: "United States",
  British: "United Kingdom",
  Canadian: "Canada",
  Chinese: "China",
  Croatian: "Croatia",
  Dutch: "Netherlands",
  Egyptian: "Egypt",
  Filipino: "Philippines",
  French: "France",
  Greek: "Greece",
  Indian: "India",
  Irish: "Ireland",
  Italian: "Italy",
  Jamaican: "Jamaica",
  Japanese: "Japan",
  Kenyan: "Kenya",
  Malaysian: "Malaysia",
  Mexican: "Mexico",
  Moroccan: "Morocco",
  Polish: "Poland",
  Portuguese: "Portugal",
  Russian: "Russia",
  Spanish: "Spain",
  Thai: "Thailand",
  Tunisian: "Tunisia",
  Turkish: "Turkey",
  Ukrainian: "Ukraine",
  Uruguayan: "Uruguay",
  Vietnamese: "Vietnam",
};

const fallbackAreas = Object.keys(countryLabels);

const toCountryOptions = (areas) => areas
  .filter((area) => countryLabels[area])
  .map((area) => [area, countryLabels[area]]);

function RecipeSearchPage() {
  const [countryOptions, setCountryOptions] = useState(
    toCountryOptions(fallbackAreas)
  );
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [ingredient, setIngredient] = useState("");

  useEffect(() => {
    getRecipeAreas()
      .then((response) => setCountryOptions(toCountryOptions(response.areas ?? [])))
      .catch((error) => console.error("Error loading recipe countries:", error));
  }, []);

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();

    setLoading(true);
    setIsError(false);
    setHasSearched(true);

    try {
      const response = await searchRecipes({
        q: query,
        category,
        country,
        ingredient,
      });

      setRecipes(response?.meals ?? []);
    } catch (error) {
      console.error("Error searching recipes:", error);
      setIsError(true);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setCategory("");
    setCountry("");
    setIngredient("");
    setRecipes([]);
    setHasSearched(false);
    setIsError(false);
  };

  return (
    <PageLayout>
      <main className="recipe-search-page">

        <h1>Recipe Search</h1>

        <p>
          Find the perfect recipe using the ingredients and
          filters you prefer.
        </p>

        <form
          className="recipe-search-form"
          onSubmit={handleSearch}
        >

          <div className="search-field">
            <label htmlFor="query">
              Search recipe
            </label>

            <input
              id="query"
              type="text"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="e.g. chicken"
            />
          </div>

          <div className="search-field">
            <label htmlFor="category">
              Category
            </label>

            <select
              id="category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >
              <option value="">All categories</option>
              <option value="Beef">Beef</option>
              <option value="Chicken">Chicken</option>
              <option value="Dessert">Dessert</option>
              <option value="Lamb">Lamb</option>
              <option value="Miscellaneous">
                Miscellaneous
              </option>
              <option value="Pasta">Pasta</option>
              <option value="Pork">Pork</option>
              <option value="Seafood">Seafood</option>
              <option value="Side">Side</option>
              <option value="Starter">Starter</option>
              <option value="Vegan">Vegan</option>
              <option value="Vegetarian">
                Vegetarian
              </option>
            </select>
          </div>

          <div className="search-field">
            <label htmlFor="country">
              Country
            </label>

            <select
              id="country"
              value={country}
              onChange={(event) =>
                setCountry(event.target.value)
              }
            >
              <option value="">All countries</option>
              {countryOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="search-field">
            <label htmlFor="ingredient">
              Ingredient
            </label>

            <input
              id="ingredient"
              type="text"
              value={ingredient}
              onChange={(event) =>
                setIngredient(event.target.value)
              }
              placeholder="e.g. tomato"
            />
          </div>

          <div className="search-buttons">
            <button type="submit">
              Search
            </button>

            <button
              type="button"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>

        </form>

        <section className="recipe-search-results">

          <h2>Search results</h2>

          {loading && (
            <p>Searching recipes...</p>
          )}

          {!loading && isError && (
            <p>
              Unable to search recipes.
            </p>
          )}

          {!loading &&
            !isError &&
            hasSearched &&
            recipes.length === 0 && (
              <p>
                No recipes found with these filters.
              </p>
            )}

          {!loading &&
            !isError &&
            recipes.length > 0 && (

              <div className="gallery">

                {recipes.map((recipe) => (

                  <article
                    className="gallery__meal"
                    key={recipe.idMeal}
                  >

                    <Link
                      className="gallery__meal-img-link"
                      to={`/recipes/${recipe.idMeal}`}
                    >
                      <div className="gallery__meal-img-container">

                        <img
                          src={recipe.strMealThumb}
                          alt={recipe.strMeal}
                        />

                      </div>
                    </Link>

                    <h4>
                      {recipe.strMeal}
                    </h4>

                    {recipe.strArea && (
                      <p>
                        {recipe.strArea}
                      </p>
                    )}

                    <Link
                      className="gallery__meal-link"
                      to={`/recipes/${recipe.idMeal}`}
                    >
                      View recipe
                    </Link>

                  </article>

                ))}

              </div>
            )}

        </section>

      </main>
    </PageLayout>
  );
}

export default RecipeSearchPage;