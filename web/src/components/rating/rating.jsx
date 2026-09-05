
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth-context";
import { createRating, listRatings } from "../../services/api-service";

function Rating({ mealId }) {
  const { user } = useAuth();
  const [ratings, setRatings] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [savedRating, setSavedRating] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadRatings() {
      if (!mealId) {
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await listRatings(mealId);
        const recipeRatings = Array.isArray(response) ? response : [];

        if (!isCurrent) {
          return;
        }

        const ownRating = recipeRatings.find((item) => {
          const ratingUserId = item.user?.id ?? item.user?._id ?? item.user;
          return String(ratingUserId) === String(user?.id ?? user?._id);
        });

        setRatings(recipeRatings);
        setSelectedRating(ownRating?.rating ?? 0);
        setSavedRating(ownRating?.rating ?? 0);
      } catch (ratingError) {
        if (isCurrent) {
          console.error("Error loading ratings:", ratingError);
          setError("Unable to load ratings.");
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    loadRatings();

    return () => {
      isCurrent = false;
    };
  }, [mealId, user]);

  const handleRating = async (rating) => {
    if (!mealId || isSaving) {
      return;
    }

    setSelectedRating(rating);
    setError("");
    setIsSaving(true);

    try {
      const savedRatingDoc = await createRating({ mealId, rating });
      setRatings((currentRatings) => {
        const ownRatingIndex = currentRatings.findIndex((item) => {
          const ratingUserId = item.user?.id ?? item.user?._id ?? item.user;
          return String(ratingUserId) === String(user?.id ?? user?._id);
        });

        if (ownRatingIndex === -1) {
          return [...currentRatings, savedRatingDoc];
        }

        return currentRatings.map((item, index) =>
          index === ownRatingIndex ? savedRatingDoc : item
        );
      });
      setSavedRating(rating);
    } catch (ratingError) {
      console.error("Error saving rating:", ratingError);
      setError("Unable to save your rating.");
    } finally {
      setIsSaving(false);
    }
  };

  const averageRating = ratings.length
    ? ratings.reduce((total, item) => total + item.rating, 0) / ratings.length
    : 0;

  return (
    <section className="rating" aria-labelledby="rating-title">
      <h2 id="rating-title" className="rating__title">My rating</h2>

      <p className="rating__summary" aria-live="polite">
        {isLoading
          ? "Loading ratings..."
          : `${averageRating ? averageRating.toFixed(1) : "0.0"} / 5 (${ratings.length} ${ratings.length === 1 ? "vote" : "votes"})`}
      </p>

      <div className="rating__stars" role="group" aria-label="Rate this recipe from 1 to 5 stars">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            className={`rating__star ${rating <= selectedRating ? "rating__star--selected" : ""}`}
            type="button"
            aria-label={`${rating} ${rating === 1 ? "star" : "stars"}`}
            aria-pressed={rating === selectedRating}
            onClick={() => handleRating(rating)}
            disabled={!mealId || isLoading || isSaving}
          >
            {rating <= selectedRating ? "★" : "☆"}
          </button>
        ))}
      </div>

      {savedRating > 0 && !error && <p className="rating__feedback">Your rating: {savedRating} / 5</p>}
      {error && <p className="rating__error" role="alert">{error}</p>}

      {!isLoading && ratings.length > 0 && (
        <div className="rating__list">
          <h3 className="rating__list-title">Ratings</h3>
          {ratings.map((item) => {
            const ratingUser = item.user ?? {};
            const userName = ratingUser.name || ratingUser.username || "User";

            return (
              <div className="rating__item" key={item.id}>
                <span className="rating__user">{userName}</span>
                <span className="rating__item-stars" aria-label={`${item.rating} out of 5 stars`}>
                  {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
                </span>
                <span className="rating__item-value">{item.rating}/5</span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Rating;