
function PantryItem({ item }) {
  return (
    <div className="pantry-item">
      <h3>{item.ingredient}</h3>
      <p>Quantity: {item.quantity} {item.unit}</p>
    </div>
  );
}

export default PantryItem;