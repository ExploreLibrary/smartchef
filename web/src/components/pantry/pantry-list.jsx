import PantryItem from "./pantry-item";
import PantryForm from "./pantry-form";

function PantryList({ pantryData, onItemCreated }) {
  const items = Array.isArray(pantryData) ? pantryData : [];

  return (
    <div className="pantry-list-container">
        <div className="pantry-list">
            {items.length > 0 ? (
            <ul>
                {items.map((item) => (
                <li key={item.id}> <PantryItem item={item} /></li>
                ))}
            </ul>
            ) : (
            <p>Your pantry is empty.</p>
            )}
        </div>

        <div className="pantry-form-container">
          <PantryForm onItemCreated={onItemCreated} />
        </div>
    </div>
  );
}

export default PantryList;