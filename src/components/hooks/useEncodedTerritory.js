import { useMemo } from "react";
import { useLocation } from "react-router-dom";

/**
 * Custom hook to get both encoded and decoded territory from URL (?ec=...)
 */
export default function useEncodedTerritory() {
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
    const encoded = params.get("ec");
    const decoded = safeDecode(encoded);

    // ✅ return both
    return {
      encoded,  // e.g. "TlVDLU1VTUJBSS1CTA=="
      decoded,  // e.g. "NUC-MUMBAI-BL"
    };
  }, [location.search]);
}
