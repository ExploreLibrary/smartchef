
import { useState } from "react";
import { deletePantryItem } from "../../services/api-service";

function PantryItem({ item, onItemDeleted }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deletePantryItem(item.id);
      onItemDeleted?.(item.id);
    } catch (error) {
      console.error("Error deleting pantry item:", error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="pantry-item">
      <div>
        <h3>{item.ingredient}</h3>
        <p>Quantity: {item.quantity} {item.unit}</p>
      </div>
      <button
        type="button"
        className="pantry-item__delete-button"
        onClick={handleDelete}
        disabled={isDeleting}
        aria-label={`Delete ${item.ingredient}`}
        title="Delete ingredient"
      >
        X
      </button>
    </div>
  );
}

export default PantryItem;