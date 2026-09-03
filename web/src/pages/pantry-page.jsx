
import { PageLayout } from "../layouts";
import PantryList from "../components/pantry/pantry-list";
import { useState, useEffect } from "react";
import { getPantry } from "../services/api-service";

function PantryPage() {
  const [pantry, setPantry] = useState({});
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchPantry() {
      try {
        const response = await getPantry();
        setPantry(response);
      } catch {
        setIsError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchPantry();
  }, []);

  return (
    <PageLayout>
      {loading && <p>Cargando receta...</p>}
      {isError && <p>No se pudo cargar la receta.</p>}
      {!loading && !isError && <PantryList pantryData={pantry} />}
    </PageLayout>
  );
}

export default PantryPage;
