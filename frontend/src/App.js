import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function AdminRoutes() {
  const { data: currentUser } = useCurrentUser();
  if (!hasRole(currentUser, "ROLE_ADMIN")) return null;
  return (
    <>
      <Route path="/admin/users" element={<AdminUsersPage />} />
      <Route path="/admin/jobs" element={<AdminJobsPage />} />
      <Route path="/admin/reports" element={<AdminReportsPage />} />
      <Route path="/admin/report/:reportId" element={<AdminViewReportPage />} />
      <Route path="/admin/createcommons" element={<AdminCreateCommonsPage />} />
      <Route path="/admin/listcommons" element={<AdminListCommonsPage />} />
      <Route path="/admin/editcommons/:id" element={<AdminEditCommonsPage />} />
    </>
  );
}

function UserRoutes() {
  const { data: currentUser } = useCurrentUser();
  if (!hasRole(currentUser, "ROLE_USER")) return null;
  return (
    <>
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/leaderboard/:commonsId" element={<LeaderboardPage />}/>
      <Route path="/play/:commonsId" element={<PlayPage />} />
    </>
  );
}

function HomeRoutes() {
  const {data: currentUser } = useCurrentUser();
  return hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "ROLE_USER") 
  ? <HomePage /> : <LoginPage />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRoutes />} /> {/* Home page routing */}
        <Route path="*" element={<AdminRoutes />} />
        <Route path="*" element={<UserRoutes />} />
        <Route path="*" element={<NotFoundPage />} /> {/* Fallback 404 route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;