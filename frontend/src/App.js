import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, useContext, createContext } from 'react';
import HomePage from "main/pages/HomePage";
import LoginPage from "main/pages/LoginPage";
import ProfilePage from "main/pages/ProfilePage";
import LeaderboardPage from "main/pages/LeaderboardPage";

import AdminUsersPage from "main/pages/AdminUsersPage";
import AdminJobsPage from "main/pages/AdminJobsPage";
import AdminCreateCommonsPage from "main/pages/AdminCreateCommonsPage";
import AdminViewReportPage from "main/pages/AdminViewReportPage";

import AdminEditCommonsPage from "main/pages/AdminEditCommonsPage";
import AdminListCommonsPage from "main/pages/AdminListCommonPage";
import AdminReportsPage from "main/pages/AdminReportsPage";
import { hasRole, useCurrentUser } from "main/utils/currentUser";
import PlayPage from "main/pages/PlayPage";
import NotFoundPage from "main/pages/NotFoundPage";

const NavigationContext = createContext();

// Custom hook to handle navigation
const useNavigation = () => {
  const [currentComponent, setCurrentComponent] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigationStart = (Component) => {
    setCurrentComponent(<Component />);
    setIsNavigating(true);
  };

  const handleNavigationEnd = () => {
    setIsNavigating(false);
  };

  return { currentComponent, isNavigating, handleNavigationStart, handleNavigationEnd };
};

function RouteWrapper({ component: Component, ...props }) {
  const { handleNavigationStart, handleNavigationEnd } = useContext(NavigationContext);

  useEffect(() => {
    handleNavigationStart(Component);

    // You might want to use a more specific way to determine when navigation has ended.
    // This is just an example; the actual implementation will depend on your routing logic.
    const timer = setTimeout(() => {
      handleNavigationEnd();
    }, 500); // This delay should match the time it takes for the component to load.

    return () => clearTimeout(timer);
  }, [Component, handleNavigationStart, handleNavigationEnd]);

  return <Component {...props} />;
}

function App() {

  const { data: currentUser } = useCurrentUser();
  const { currentComponent, isNavigating, handleNavigationStart, handleNavigationEnd } = useNavigation();

  // Define admin routes
  const adminRoutes = hasRole(currentUser, "ROLE_ADMIN") ? (
    <>
      <Route path="/admin/users" element={<RouteWrapper component={AdminUsersPage} />} />
      <Route path="/admin/jobs" element={<RouteWrapper component={AdminJobsPage} />} />
      <Route path="/admin/reports" element={<RouteWrapper component={AdminReportsPage} />} />
      <Route path="/admin/report/:reportId" element={<RouteWrapper component={AdminViewReportPage} />} />
      <Route path="/admin/createcommons" element={<RouteWrapper component={AdminCreateCommonsPage} />} />
      <Route path="/admin/listcommons" element={<RouteWrapper component={AdminListCommonsPage} />} />
      <Route path="/admin/editcommons/:id" element={<RouteWrapper component={AdminEditCommonsPage} />} />
    </>
  ) : null;

  // Define user routes
  const userRoutes = hasRole(currentUser, "ROLE_USER") ? (
    <>
      <Route path="/profile" element={<RouteWrapper component={ProfilePage} />} />
      <Route path="/leaderboard/:commonsId" element={<RouteWrapper component={LeaderboardPage} />}/>
      <Route path="/play/:commonsId" element={<RouteWrapper component={PlayPage} />} />
    </>
  ) : null;

  // Choose the homepage based on roles
  const homeRoute = (hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "ROLE_USER")) 
    ? <Route path="/" element={<RouteWrapper component={HomePage} />} /> 
    : <Route path="/" element={<RouteWrapper component={LoginPage} />} />;

  return (
    <BrowserRouter>
      <NavigationContext.Provider value={{ handleNavigationStart, handleNavigationEnd }}>
        {isNavigating ? currentComponent : (
          <Routes>
            {homeRoute}
            {adminRoutes}
            {userRoutes}
            <Route path="*" element={<NotFoundPage />} /> {/* Fallback 404 route */}
          </Routes>
        )}
      </NavigationContext.Provider>
    </BrowserRouter>
  );
}

export default App;