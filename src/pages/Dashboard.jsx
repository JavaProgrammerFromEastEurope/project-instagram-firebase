import { useEffect } from "react";
import PropTypes from "prop-types";
import { Header, Timeline } from "../components";
import { Sidebar } from "../components/sidebar";
import useUser from "../hooks/use-user";
import { LoggedInUserContext } from "../context/logged-in-user";

const Dashboard = ({ user: loggedInUser }) => {
  console.log("Dashboard")
  const { user, setActiveUser } = useUser(loggedInUser.uid);
  useEffect(() => {
    document.title = "Instagram";
  }, [loggedInUser]);

  return (
    <LoggedInUserContext.Provider value={{ user, setActiveUser }}>
      <div className="bg-gray-background">
        <Header />
        <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
          <Timeline />
          <Sidebar />
        </div>
      </div>
    </LoggedInUserContext.Provider>
  );
};

Dashboard.propTypes = {
  user: PropTypes.object.isRequired
};

export default Dashboard;
