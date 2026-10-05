import { useEffect, useState } from "react";

export const useDeals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/deals`,
          { headers: { Accept: "application/json" }, signal: controller.signal }
        );
        if (!res.ok) throw new Error("Request failed");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : data.data ?? []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("Could not load products.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  return { products, loading, error };
};