import "./index.css";

import { RouterProvider, createRouter } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { Web3Provider } from "@/Web3Provider";
import { Toaster } from "@/components/ui/toaster";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Web3Provider>
      <RouterProvider router={router} />
      <Toaster />
    </Web3Provider>
  </React.StrictMode>
);
