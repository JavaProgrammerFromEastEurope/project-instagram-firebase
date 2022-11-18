import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";

export default function useAuthListener() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("authUser"))
  );
  const auth = getAuth();
  useEffect(() => {
    const listener = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // we have a user...therefore we can store the user in localstorage
        localStorage.setItem("authUser", JSON.stringify(authUser));
        setUser(authUser);
        console.log("use auth => authUser = " + authUser?.displayName);
      } else {
        // we don't have an authUser, therefore clear the localstorage
        localStorage.removeItem("authUser");
        setUser(null);
        console.log("use auth => authUser = null");
      }
    });

    return () => listener();
  }, [user]);

  return { user };
}
