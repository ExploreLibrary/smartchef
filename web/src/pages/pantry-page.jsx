
import { PageLayout } from "../layouts";
import PantryList from "../components/pantry/pantry-list";
import PantryForm from "../components/pantry/pantry-form";
import { useState, useEffect } from "react";
import { getPantry } from "../services/api-service";

function PantryPage() {
  const [pantry, setPantry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const handleItemCreated = (newItem) => {
    setPantry((currentPantry) => [...currentPantry, newItem]);
  };

  const fetchPantry = async () => {
    try {
      const response = await getPantry();
      setPantry(response);
      setIsError(false);
    } catch {
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPantry();
  }, []);

  return (
    <PageLayout>
      {loading && <p>Cargando receta...</p>}
      {isError && <p>No se pudo cargar la receta.</p>}
      {!loading && !isError && (
        <>
          <PantryList
            pantryData={pantry}
            onItemCreated={handleItemCreated}
          />
        </>
      )}
    </PageLayout>
  );
}

export default PantryPage;
