import { createContext, useContext, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";

import type { SpotifyUser } from "@/services/spotify";

const UserContext = createContext<SpotifyUser | undefined | null>(null);

export function useSpotifyUser() {
  const context = useContext(UserContext);

  if (context === null) {
    throw new Error("UserContext.Provider가 없습니다.");
  }
  return context;
}

export function SpotifyUserProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<SpotifyUser>();

  useEffect(() => {
    async function fetchUser() {
      const response = await fetch("/api/me");

      if (response.ok) {
        const user = (await response.json()) as SpotifyUser;
        setUser(user);
      }
    }

    if (user === undefined) {
      void fetchUser();
    }
  }, [user]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
