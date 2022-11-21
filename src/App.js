import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import ReactLoader from "./components/Loader";
import * as ROUTES from "./routes";
import { UserContext } from "./context";
import useAuthListener from "./hooks/use-auth-listener";

const Login     = lazy(() => import("./pages/LoginPage"));
const SignUp    = lazy(() => import("./pages/SignUpPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile   = lazy(() => import("./pages/ProfilePage"));
const NotFound  = lazy(() => import("./pages/NotFoundPage"));

export default function App() {
  const { user } = useAuthListener();
  console.log("App => useAuthListener: " + user?.displayName);

  return (
    <UserContext.Provider value={{ user }}>
      <Router>
        <Suspense fallback={<ReactLoader />}>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
            <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
            <Route
              path={ROUTES.DASHBOARD}
              element={
              user != null
                ? (<Dashboard user={{ user }}/>)
                : (<Navigate to={ROUTES.LOGIN}/>)
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </UserContext.Provider>
  );
}
