
import { useState } from "react";
import { createRating } from "../../services/api-service";

function Rating({ mealId }) {
  const [selectedRating, setSelectedRating] = useState(0);
  const [savedRating, setSavedRating] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleRating = async (rating) => {
    if (!mealId || isSaving) {
      return;
    }

    setSelectedRating(rating);
    setError("");
    setIsSaving(true);

    try {
      await createRating({ mealId, rating });
      setSavedRating(rating);
    } catch (ratingError) {
      console.error("Error saving rating:", ratingError);
      setError("Unable to save your rating.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="rating" aria-labelledby="rating-title">
      <h2 id="rating-title" className="rating__title">My rating</h2>

      <div className="rating__stars" role="group" aria-label="Rate this recipe from 1 to 5 stars">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            className={`rating__star ${rating <= selectedRating ? "rating__star--selected" : ""}`}
            type="button"
            aria-label={`${rating} ${rating === 1 ? "star" : "stars"}`}
            aria-pressed={rating === selectedRating}
            onClick={() => handleRating(rating)}
            disabled={!mealId || isSaving}
          >
            {rating <= selectedRating ? "★" : "☆"}
          </button>
        ))}
      </div>

      {savedRating > 0 && !error && <p className="rating__feedback">Rating saved.</p>}
      {error && <p className="rating__error" role="alert">{error}</p>}
    </section>
  );
}

export default Rating;