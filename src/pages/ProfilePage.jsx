import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserByUsername } from "../services/firebase";
import * as ROUTES from "../routes";
import { Header } from "../components";
import { Profile } from "../components/profile";

const ProfilePage = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkUserExists() {
      const [user] = await getUserByUsername(username);
      if (user?.userId) {
        setUser(user);
      } else {
        navigate(ROUTES.NOT_FOUND);
      }
    }

    checkUserExists();
  }, [username, navigate]);

  return user?.username ? (
    <div className="bg-gray-background">
      <Header />
      <div className="mx-auto max-w-screen-lg">
        <Profile user={user} />
      </div>
    </div>
  ) : null;
};

export default ProfilePage;
