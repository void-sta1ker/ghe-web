import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 120000, // 2 mins,
      refetchOnWindowFocus: false,
      retry: false,
      // cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

export default queryClient;
