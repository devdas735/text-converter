import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from '../components/layout/AppShell.jsx';
import ProtectedRoute from '../components/layout/ProtectedRoute.jsx';
import ContactPage from '../pages/ContactPage.jsx';
import ConversionDetailPage from '../pages/ConversionDetailPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import HistoryPage from '../pages/HistoryPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import PricingFeaturesPage from '../pages/PricingFeaturesPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';
import SignupPage from '../pages/SignupPage.jsx';
import TextToAudioPage from '../pages/TextToAudioPage.jsx';
import UploadFilePage from '../pages/UploadFilePage.jsx';

function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/pricing" element={<PricingFeaturesPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/text-to-audio"
          element={
            <ProtectedRoute>
              <TextToAudioPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload-file"
          element={
            <ProtectedRoute>
              <UploadFilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history/:conversionId"
          element={
            <ProtectedRoute>
              <ConversionDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
