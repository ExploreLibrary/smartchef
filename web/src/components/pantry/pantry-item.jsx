
function PantryItem({ item }) {
  return (
    <div className="pantry-item">
      <h3>{item.name}</h3>
      <p>Quantity: {item.quantity}</p>
    </div>
  );
}

export default PantryItem;