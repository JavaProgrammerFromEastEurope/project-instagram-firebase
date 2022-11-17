import { useState, useContext, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function useAuthListener() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("authUser"))
  );
  useEffect(() => {
    const auth = getAuth();
    const listener = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // we have a user...therefore we can store the user in localstorage
        localStorage.setItem("authUser", JSON.stringify(authUser?.displayName));
        setUser(authUser);
        console.log("use auth => authUser = " + user);
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
