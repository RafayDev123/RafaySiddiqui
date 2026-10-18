import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMotionPreference } from "./MotionPreferenceContext";

/**
 * Navigates to an in-page section on the homepage. From other routes, it
 * returns to the homepage with the requested section in the query string.
 */
export function useSectionNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { reduced } = useMotionPreference();

  return useCallback(
    (sectionId: string) => {
      if (location.pathname === "/") {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      } else {
        navigate(`/?section=${sectionId}`);
      }
    },
    [location.pathname, navigate, reduced]
  );
}
