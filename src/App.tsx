import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CallProvider } from './context/CallContext';
import { PaymentProvider } from './context/PaymentContext';
import { TwoFactorProvider } from './context/TwoFactorContext';
import { WalkthroughProvider } from './context/WalkthroughContext';
import { FloatingCallWidget } from './components/call/FloatingCallWidget';

// Layouts
import { DashboardLayout } from './components/layout/DashboardLayout';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Dashboard Pages
import { EntrepreneurDashboard } from './pages/dashboard/EntrepreneurDashboard';
import { InvestorDashboard } from './pages/dashboard/InvestorDashboard';

// Profile Pages
import { ProfilePage } from './pages/profile/ProfilePage';
import { EntrepreneurProfile } from './pages/profile/EntrepreneurProfile';
import { InvestorProfile } from './pages/profile/InvestorProfile';
import { MyStartup } from './pages/mystartup/MyStartup';
import { MyPortfolio } from './pages/myportfolio/MyPortfolio';

// Feature Pages
import { InvestorsPage } from './pages/investors/InvestorsPage';
import { EntrepreneursPage } from './pages/entrepreneurs/EntrepreneursPage';
import { MessagesPage } from './pages/messages/MessagesPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { DocumentChamber } from './pages/documentchamber/DocumentChamber';
import { SettingsPage } from './pages/settings/SettingsPage';
import { HelpPage } from './pages/help/HelpPage';
import { DealsPage } from './pages/deals/DealsPage';

// Chat Pages
import { ChatPage } from './pages/chat/ChatPage';
// Calendar Pages
import { CalendarPage } from './pages/calendar/CalendarPage';
// Video Call Pages
import { VideoCallPage } from './pages/videocall/VideoCallPage';
// Payment Pages
import PaymentsPage from './pages/payments/PaymentsPage';
// Security Pages
import SecurityPage from './pages/security/SecurityPage';

function App() {
  return (
    <AuthProvider>
      <PaymentProvider>
        <TwoFactorProvider>
          <WalkthroughProvider>
            <CallProvider>
              <Router>
                <FloatingCallWidget />

                <Routes>
                  {/* Auth */}
                  <Route path="/login"    element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Dashboard */}
                  <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route path="entrepreneur" element={<EntrepreneurDashboard />} />
                    <Route path="investor"     element={<InvestorDashboard />} />
                    <Route path="my-startup"   element={<MyStartup />} />
                    <Route path="my-portfolio" element={<MyPortfolio />} />
                  </Route>

                  {/* Profile */}
                  <Route path="/profile" element={<DashboardLayout />}>
                    <Route path=":role/:id" element={<ProfilePage />} />
                  </Route>

                  {/* Public profiles */}
                  <Route path="/entrepreneurs" element={<DashboardLayout />}>
                    <Route index      element={<EntrepreneursPage />} />
                    <Route path=":id" element={<EntrepreneurProfile />} />
                  </Route>

                  <Route path="/investors" element={<DashboardLayout />}>
                    <Route index      element={<InvestorsPage />} />
                    <Route path=":id" element={<InvestorProfile />} />
                  </Route>

                  <Route path="/messages" element={<DashboardLayout />}>
                    <Route index element={<MessagesPage />} />
                  </Route>

                  <Route path="/documents" element={<DashboardLayout />}>
                    <Route index element={<DocumentChamber />} />
                  </Route>

                  <Route path="/notifications" element={<DashboardLayout />}>
                    <Route index element={<NotificationsPage />} />
                  </Route>

                  <Route path="/calendar" element={<DashboardLayout />}>
                    <Route index element={<CalendarPage />} />
                  </Route>

                  <Route path="/video-call" element={<DashboardLayout />}>
                    <Route index element={<VideoCallPage />} />
                  </Route>

                  <Route path="/settings" element={<DashboardLayout />}>
                    <Route index element={<SettingsPage />} />
                  </Route>

                  <Route path="/help" element={<DashboardLayout />}>
                    <Route index element={<HelpPage />} />
                  </Route>

                  <Route path="/deals" element={<DashboardLayout />}>
                    <Route index element={<DealsPage />} />
                  </Route>

                  <Route path="/payments" element={<DashboardLayout />}>
                    <Route index element={<PaymentsPage />} />
                  </Route>

                  <Route path="/security" element={<DashboardLayout />}>
                    <Route index element={<SecurityPage />} />
                  </Route>

                  {/* Chat */}
                  <Route path="/chat" element={<DashboardLayout />}>
                    <Route index          element={<ChatPage />} />
                    <Route path=":userId" element={<ChatPage />} />
                  </Route>

                  {/* Redirects */}
                  <Route path="/"  element={<Navigate to="/login" replace />} />
                  <Route path="*"  element={<Navigate to="/login" replace />} />
                </Routes>
              </Router>
            </CallProvider>
          </WalkthroughProvider>
        </TwoFactorProvider>
      </PaymentProvider>
    </AuthProvider>
  );
}

export default App;