"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import { ThemeProvider } from "@/components/theme-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange={false}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "hsl(var(--background-card))",
              color: "hsl(var(--text-primary))",
              border: "1px solid hsl(var(--border-primary))",
              borderRadius: "12px",
              padding: "12px 16px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
              backdropFilter: "blur(20px)",
            },
            success: {
              iconTheme: {
                primary: "hsl(var(--status-success))",
                secondary: "white",
              },
            },
            error: {
              iconTheme: {
                primary: "hsl(var(--status-error))",
                secondary: "white",
              },
            },
            loading: {
              iconTheme: {
                primary: "hsl(var(--cloudsway-primary-500))",
                secondary: "white",
              },
            },
          }}
        />

        {/* React Query Devtools can be added later */}
      </QueryClientProvider>
    </ThemeProvider>
  );
}