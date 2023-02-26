import type { SpotifyUser } from "@/services/spotify";
import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext<SpotifyUser | undefined | null>(null);

export function useSpotifyUser() {
  const context = useContext(UserContext);

  if (context === null) {
    throw new Error("UserContext.Provider가 없습니다.");
  }
  return context;
}

export function SpotifyUserProvider({ children }: PropsWithChildren<unknown>) {
  const [user, setUser] = useState<SpotifyUser>();

  useEffect(() => {
    async function fetchUser() {
      const response = await fetch("/api/me");

      if (response.ok) {
        const user = await response.json();
        setUser(user);
      }
    }

    if (user === undefined) {
      fetchUser();
    }
  }, [user]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
