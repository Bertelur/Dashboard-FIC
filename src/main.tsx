import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/index.css'
import { AuthProvider } from './features/auth/store/auth.store'
import App from './app/App'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from 'sonner'
import { Analytics } from "@vercel/analytics/next"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        <Analytics />
        <Toaster richColors position={"bottom-right"} />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
)
