import { useContext } from "react";
import User from "./User";
import Suggestions from "./Suggestions";
import SuggestedProfile from "./SuggestedProfile";
import { LoggedInUserContext } from "../../context";

const Sidebar = () => {
  const { user: { docId = "", fullName, username, userId, following } = {} } =
    useContext(LoggedInUserContext);
  console.log("Sidebar");
  return (
    <div className="p-4">
      <User username={username} fullName={fullName} />
      <Suggestions
        userId={userId}
        following={following}
        loggedInUserDocId={docId}
      />
    </div>
  );
};

export { Sidebar, Suggestions, User, SuggestedProfile };
