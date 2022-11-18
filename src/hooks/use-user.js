import { useState, useEffect } from "react";
import { getUserByUserId } from "../services/firebase";

export default function useUser(userId) {
  const [activeUser, setActiveUser] = useState();
  console.log("user hook userId = "+ userId);

  useEffect(() => {
    async function getUserObjByUserId(userId) {
      const [user] = await getUserByUserId(userId);
      setActiveUser(user || {});
    }

    if (userId) {
      getUserObjByUserId(userId);
    }
  }, [userId]);

  return { user: activeUser, setActiveUser };
}
