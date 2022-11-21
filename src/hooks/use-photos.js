import { useState, useEffect } from "react";
import { getPhotos } from "../services/firebase";

export default function usePhotos(user) {
  const [photos, setPhotos] = useState(null);

  useEffect(() => {
    async function getTimelinePhotos() {
      console.log("use photos => user = " + user?.displayName);

      // does the user actually follow people?
      if (user?.following?.length > 0) {
        console.log("Before getPhoto: user = " + user?.displayName);
        const followedUserPhotos = await getPhotos(user?.userId, user?.following);
        console.log("After get Photo: photos = " + followedUserPhotos);
        // re-arrange array to be newest photos first by dateCreated
        followedUserPhotos.sort((a, b) => b.dateCreated - a.dateCreated);
        setPhotos(followedUserPhotos);
      }
    }

    getTimelinePhotos();
  }, [user]);

  return { photos };
}
