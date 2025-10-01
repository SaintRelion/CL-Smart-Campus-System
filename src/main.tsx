import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@saintrelion/auth-lib";
import { router } from "./navigations";

import "./main.css";

import "@/lib/firebase-client";
import "@/data-access-config";

import "@/repositories/attendance";
import "@/repositories/classes";
import "@/repositories/classes-notifications";
import "@/repositories/enrolled-classes";
import "@/repositories/users";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </AuthProvider>,
);
