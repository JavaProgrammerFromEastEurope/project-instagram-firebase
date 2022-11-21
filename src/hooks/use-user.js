import { useState, useEffect } from "react";
import { getUserByUserId } from "../services/firebase";

export default function useUser(userId) {
  const [activeUser, setActiveUser] = useState();

  useEffect(() => {
    async function getUserObjByUserId() {
      if (userId) {
        const user = await getUserByUserId(userId);
        setActiveUser(user || {});
      }
    }
    getUserObjByUserId();
  }, [userId]);

  return { user: activeUser, setActiveUser };
}
