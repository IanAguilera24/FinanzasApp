// src/hooks/useFirestoreQuery.js
import { useEffect, useState } from "react";
import { onSnapshot } from "firebase/firestore";

export function useFirestoreQuery(firestoreQuery) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!firestoreQuery) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      firestoreQuery,
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setData(docs);
        setLoading(false);
      },
      (err) => {
        console.error("Error en query de Firestore:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestoreQuery]);

  return { data, loading, error };
}