import { useState, useEffect } from "react";
import { getUserByUserId } from "../services/firebase";

export default function useUser(userId) {
  const [activeUser, setActiveUser] = useState();

  useEffect(() => {
    async function getUserObjByUserId(userId) {
      const [user] = await getUserByUserId(userId);
      setActiveUser(user || {});
    }
    console.log("user hook user = " + activeUser);
    if (userId) {
      getUserObjByUserId(userId);
    }
  }, [activeUser, userId]);

  return { user: activeUser, setActiveUser };
}
