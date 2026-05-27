import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { postsService } from "@/services/api";
import { queryKeys } from "@/lib/query-keys";
import { DashboardClient } from "@/components/DashboardClient";

export default async function HomePage() {
  const qc = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 2 } },
  });

  await qc.prefetchQuery({
    queryKey: queryKeys.posts.list(1),
    queryFn: () => postsService.getPosts(1, 9),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <DashboardClient />
    </HydrationBoundary>
  );
}
