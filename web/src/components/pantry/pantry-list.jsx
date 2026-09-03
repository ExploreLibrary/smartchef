import PantryItem from "./pantry-item";

function PantryList({ pantryData }) {

  return (
    <div className="pantry-list">
        {pantryData.items && pantryData.items.length > 0 ? (
          <ul>
            {pantryData.items.map((item) => (
              <li key={item.id}> <PantryItem item={item} /></li>
            ))}
          </ul>
        ) : (
          <p>Your pantry is empty.</p>
        )}
    </div>
  );
}

export default PantryList;