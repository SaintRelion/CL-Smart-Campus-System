import { createRoot } from "react-dom/client";
import "./main.css";

import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationProvider } from "@saintrelion/notifications";
import { AuthProvider } from "@saintrelion/auth-lib";
import { router } from "./navigations";

import "@/lib/firebase-client";

import "@/data-access-config";
import "@/repositories/attendance";
import "@/repositories/classes";
import "@/repositories/user";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <NotificationProvider>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  </NotificationProvider>,
);
