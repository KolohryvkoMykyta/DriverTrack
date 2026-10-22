import { useOutletContext } from "react-router-dom";

import type { CurrentUser } from "../api/authApi";

type DriverLayoutContext = {
  currentUser: CurrentUser;
};

export function useDriverUser() {
  return useOutletContext<DriverLayoutContext>().currentUser;
}