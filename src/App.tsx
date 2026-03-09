import { lazy, Suspense } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router";
import { Toaster } from "sonner";
import UserEditForm from "./components/UserProfile/UserEditForm";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { ConcentNotification } from "./components/header/notification/ConcentNotification";
import NotificationNewOrder from "./components/header/notification/NewOrderNotification";
import { LoadingCakeFullSize } from "./components/ui/LoadingCake";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import AppLayout from "./layout/AppLayout";
import ErrorBoundary from "./lib/ErrorBoundary";
import SignIn from "./pages/AuthPages/SignIn";
import UserProfiles from "./pages/UserProfiles";
import NotFound from "./pages/OtherPage/NotFound";



const Home = lazy(() => import("./pages/Dashboard/Home"));
const UsersList = lazy(() => import("./pages/Users/UsersList"));
const SettingsList = lazy(() => import("./pages/Settings/SettingsList"));
const SettingsEdit = lazy(() => import("./pages/Settings/SettingsEdit"));
const OrdersList = lazy(() => import("./pages/Orders/OrdersList"));
const OrderDetails = lazy(() => import("./pages/Orders/OrderDetails"));
const AgentsList = lazy(() => import("./pages/Agents/AgentsList"));
const CompaniesList = lazy(() => import("./pages/Companies/CompaniesList"));
const AnalyticsDashboard = lazy(
  () => import("./pages/Analytics/AnalyticsDashboard"),
);
const OrderAssignments = lazy(
  () => import("./pages/Assignments/OrderAssignments"),
);

export default function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Toaster position="top-right" richColors closeButton={true} />
          <Routes>
            {/* Auth Layout - Public Route */}
            <Route path="/signin" element={<SignIn />} />
           

            {/* Protected Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <NotificationProvider>
                    <NotificationNewOrder />
                    <ConcentNotification />
                    <AppLayout />
                  </NotificationProvider>
                </ProtectedRoute>
              }
            >
              {/* Others Page */}
              <Route path="/profile" element={<UserProfiles />} />

              <Route
                index
                path="/"
                element={<Navigate to="/admin/dashboard" />}
              />
              <Route path="admin">
                <Route index element={<Navigate to="/admin/dashboard" />} />
                <Route
                  path="dashboard"
                  element={
                    <ErrorBoundary>
                      <Suspense fallback={<LoadingCakeFullSize />}>
                        <Home />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="analytics"
                  element={
                    <ErrorBoundary>
                      <Suspense fallback={<LoadingCakeFullSize />}>
                        <AnalyticsDashboard />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="assignments"
                  element={
                    <ErrorBoundary>
                      <Suspense fallback={<LoadingCakeFullSize />}>
                        <OrderAssignments />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="agents"
                  element={
                    <ErrorBoundary>
                      <Suspense fallback={<LoadingCakeFullSize />}>
                        <AgentsList />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="companies"
                  element={
                    <ErrorBoundary>
                      <Suspense fallback={<LoadingCakeFullSize />}>
                        <CompaniesList />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route path="orders">
                  <Route
                    index
                    element={
                      <ErrorBoundary>
                        <Suspense fallback={<LoadingCakeFullSize />}>
                          <OrdersList />
                        </Suspense>
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path=":orderId"
                    element={
                      <ErrorBoundary>
                        <Suspense fallback={<LoadingCakeFullSize />}>
                          <OrderDetails />
                        </Suspense>
                      </ErrorBoundary>
                    }
                  />
                </Route>

                <Route path="reports">
                  <Route
                    index
                    element={
                      <NotFound />
                    }
                  />
                </Route>
               
                {/* Admin Users */}
                <Route path="users">
                  <Route
                    index
                    element={
                      <Suspense fallback={<LoadingCakeFullSize />}>
                        <UsersList />
                      </Suspense>
                    }
                  />
                  <Route
                    path=":edit"
                    element={
                      <Suspense fallback={<LoadingCakeFullSize />}>
                        <UserEditForm />
                      </Suspense>
                    }
                  />
                </Route>
               

               


                {/* Settings */}
                <Route path="settings">
                  <Route
                    index
                    element={
                      <Suspense fallback={<LoadingCakeFullSize />}>
                        <SettingsList />
                      </Suspense>
                    }
                  />
                  <Route
                    path="add"
                    element={
                      <Suspense fallback={<LoadingCakeFullSize />}>
                        <SettingsEdit />
                      </Suspense>
                    }
                  />
                  <Route
                    path="edit/:uuid"
                    element={
                      <Suspense fallback={<LoadingCakeFullSize />}>
                        <SettingsEdit />
                      </Suspense>
                    }
                  />
                </Route>
              </Route>
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}
