import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { useNotificationStore } from "./stores/notification.store";
import { useStore } from "zustand/react";

// Load les composants utiles
import { LayoutDefault } from "@/components/display/LayoutDefault";
import { LayoutAuth } from "./components/display/LayoutAuth";
import { Toast } from "@/components/ui/Toast";

// Load les pages du routage
import DashboardPage from "@/routes/DashboardPage";
import ChatsPage from "@/routes/ChatsPage";
import ServerPage from "@/routes/network/ServerPage";
import TokensPage from "@/routes/network/TokensPage";
import RulePage from "@/routes/network/RulePage";
import UsersPage from "@/routes/team/UsersPage";
import SettingsPage from "@/routes/account/SettingsPage";
import LoginPage from "@/routes/auth/LoginPage";
import RegisterPage from "@/routes/auth/RegisterPage";
import OtpPage from "./routes/auth/OtpPage";
import ResetPasswordPage from "./routes/auth/ResetPasswordPage";
import ForgotPasswordPage from "./routes/auth/ForgotPasswordPage";

// Load les styles globaux
import "./App.css";
import DetailsServerPage from "./routes/network/DetailsServerPage";

function Build() {
  const { close, visible, message, color } = useStore(useNotificationStore);

  // CECI PERMET DE CHECKER S'IL Y A UNE NOTIFICATIONS ET AU BOUT D'UN
  // MOMENT LA RETIRE
  useEffect(() => {
    console.log("new-notification =>", message);
    setTimeout(() => {
      if (visible) {
        close();
      }
    }, 5000);
  }, [close, visible, message]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<LayoutDefault />}>
            <Route index element={<DashboardPage />} />
            <Route path="network">
              <Route path="servers" element={<ServerPage />} />
              <Route path="servers/:id" element={<DetailsServerPage />} />
              <Route path="tokens" element={<TokensPage />} />
              <Route path="rule" element={<RulePage />} />
            </Route>
            <Route path="team">
              <Route path="users" element={<UsersPage />} />
            </Route>
            <Route path="account">
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="/chats" element={<ChatsPage />} />
          </Route>
          <Route path="auth" element={<LayoutAuth />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="verification" element={<OtpPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
          </Route>
        </Routes>

        <div className="toast-bottom">
          {visible && (
            <div className="animate-notif">
              <Toast
                variant={color}
                onClose={close}
                message={message as string}
              />
            </div>
          )}
        </div>
      </BrowserRouter>
    </>
  );
}

export default Build;
