import { SessionProvider, useSession } from "next-auth/react";
import { useState } from "react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <SessionProvider
      basePath="/pttpk-penilaian/api/auth"
      baseUrl="/pttpk-penilaian"
      session={session}
    >
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps?.dehydrateState}>
          {Component.Auth ? <Auth /> : <Component {...pageProps} />}
        </Hydrate>
      </QueryClientProvider>
    </SessionProvider>
  );
}

function Auth({ children, roles }) {
  const { data, status } = useSession({
    required: true,
    onUnauthenticated: () => signIn(),
  });

  const currentRole = data?.user?.role;

  if (status === "loading") {
    return <Spin />;
  }

  if (data?.user && roles.includes(currentRole)) {
    return children;
  } else {
    return <div>error</div>;
  }
}
