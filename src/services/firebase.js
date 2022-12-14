import {
  getFirestore,
  arrayUnion,
  arrayRemove,
  collection,
  query,
  where,
  doc,
  addDoc,
  updateDoc,
  getDocs
} from "firebase/firestore";
import { app } from "../lib/firebase";

// collection paths from the firebase
const db   = getFirestore(app);
const users  = collection(db, "users");
const photos = collection(db, "photos");

export async function doesUsernameExist(username) {
  const q = query(users,
		where("username", "==", username.toLowerCase()));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.length > 0;
}

export async function addNewUser(userId, username, fullName, emailAddress) {
  addDoc(users, {
    userId: userId,
    username: username.toLowerCase(),
    fullName,
    emailAddress: emailAddress.toLowerCase(),
    following: ["2"],
    followers: [],
    dateCreated: Date.now()
  });
}

export async function getUserByUsername(username) {
  const q = query(users,
		where("username", "==", username.toLowerCase()));
  const querySnapshot = await getDocs(q);

  let user;
  querySnapshot.forEach((item) => {
    user = item.data();
    user.docId = item.id;
  });
  return user;
}

// get user from the firestore where userId === userId (passed from the auth)
export async function getUserByUserId(userId) {
  const q = query(users, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  let user;
	querySnapshot.forEach((item) => {
    user = item.data();
    user.docId = item.id;
  });
	return user;
}

// check all conditions before limit results
export async function getSuggestedProfiles(userId, following) {
  let q;
  following.length > 0
    ? (q = query(users, where("userId", "not-in", [...following, userId])))
    : (q = query(users, where("userId", "!=", userId)));
  const querySnapshot = await getDocs(q);

	let profiles = [];
  querySnapshot.forEach((item) => {
		const profile = item.data();
    profile.docId = item.id;
    profiles.push(profile);
  });
  return profiles;
}

export async function isUserFollowingProfile(
  loggedInUserUsername,
  profileUserId
) {
  const q = query(
    users,
    where("username", "==", loggedInUserUsername),
    where("following", "array-contains", profileUserId)
  );
  const usersSnapshot = await getDocs(q);
  return usersSnapshot.docs.length > 0;
}

export async function updateLoggedInUserFollowing(
  loggedInUserDocId, // currently logged in user document id (authorized profile)
  profileId, // the user that authorized requests to follow
  isFollowingProfile // true/false (am i currently following this person?)
) {
  const userRef = doc(db, "users", loggedInUserDocId);
  return await updateDoc(userRef, {
    following: isFollowingProfile
      ? arrayRemove(profileId)
      : arrayUnion(profileId)
  });
}

export async function updateFollowedUserFollowers(
  profileDocId, // the user that authorized requests to follow
  loggedInUserDocId, // currently logged in user document id (authorized profile)
  isFollowingProfile // true/false (am i currently following this person?)
) {
	const profileRef = doc(db, "users", profileDocId);
  return await updateDoc(profileRef, {
    followers: isFollowingProfile
      ? arrayRemove(loggedInUserDocId)
      : arrayUnion(loggedInUserDocId)
  });
}

export async function updateLikesCounter(userId, docId, toggleLiked) {
  const photosRef = doc(db, "photos", docId);
  return await updateDoc(photosRef, {
    likes: toggleLiked ? arrayRemove(userId) : arrayUnion(userId)
  });
}

export async function updateComments(docId, displayName, comment) {
  const photosRef = doc(db, "photos", docId);
  return await updateDoc(photosRef, {
    comments: arrayUnion({ displayName, comment })
  });
}

export async function getUserPhotosByUserId(userId) {
  const q = query(photos, where("userId", "==", userId));
  const photosSnapshot = await getDocs(q);

  let photoArray = [];
  photosSnapshot.forEach((item) => {
    const photo = item.data();
    photo.docId = item.id;
    photoArray.push(photo);
  });
  return photoArray;
}

export async function getPhotos(userId, following) {
  const q = query(photos, where("userId", "in", following));
  const photosSnapshot = await getDocs(q);

  let usersPhotos = [];
  photosSnapshot.forEach((item) => {
    const photo = item.data();
    photo.docId = item.id;
    usersPhotos.push(photo);
  });

  const photoWithUserDetails = await Promise.all(
    usersPhotos.map(async (photo) => {
      let userLikedPhoto;
      photo.likes?.includes(userId)
        ? (userLikedPhoto = true)
        : (userLikedPhoto = false);

      const user = await getUserByUserId(photo.userId);
      return { username: user?.username, ...photo, userLikedPhoto };
    })
  );
  return photoWithUserDetails;
}

export async function toggleFollow(
  isFollowingProfile,
  activeUserDocId,
  profileDocId,
  profileUserId,
  followingUserId
) {
	// 1st param: authorized doc id
  // 2nd param: raphael's user id
  // 3rd param: is the user following this profile? e.g. does authorized follow raphael? (true/false)
  await updateLoggedInUserFollowing(
    activeUserDocId,
    profileUserId,
    isFollowingProfile
  );

  // 1st param: authorized user id
  // 2nd param: raphael's doc id
  // 3rd param: is the user following this profile? e.g. does authorized follow raphael? (true/false)
  await updateFollowedUserFollowers(
    profileDocId,
    followingUserId,
    isFollowingProfile
  );
}
