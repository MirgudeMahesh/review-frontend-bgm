import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export default function useProfileTerritory() {
  const location = useLocation();

  // --- Safe Base64 decode helper ---
  const safeDecode = (encoded) => {
    try {
      return encoded ? atob(decodeURIComponent(encoded)) : null;
    } catch (err) {
      console.error("safeDecode error:", err);
      return null;
    }
  };

  // --- Memoized extraction and decoding ---
  return useMemo(() => {
    const params = new URLSearchParams(location.search);
    const profileEncodedTerritory = params.get("pec"); // query param: ?pec=...
    const profileTerritory = safeDecode(profileEncodedTerritory);

    // ✅ return both with meaningful names
    return {
      profileEncodedTerritory, // Base64 version
      profileTerritory,        // Decoded readable version
    };
  }, [location.search]);
}
