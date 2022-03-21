import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import { ConfigProvider, Spin } from "antd";
import id from "antd/lib/locale/id_ID";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
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
        <ConfigProvider locale={id}>
          <Hydrate state={pageProps?.dehydrateState}>
            {Component.Auth ? (
              <Auth
                roles={Component?.Auth?.roles}
                groups={Component?.Auth?.groups}
              >
                <Component {...pageProps} />
              </Auth>
            ) : (
              <Component {...pageProps} />
            )}
          </Hydrate>
        </ConfigProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

function Auth({ children, roles, groups }) {
  const { data, status } = useSession({
    required: true,
    onUnauthenticated: () => signIn(),
  });

  const currentRole = data?.user?.role;
  const currentGroup = data?.user?.group;

  if (status === "loading") {
    return <Spin />;
  }

  if (
    data?.user &&
    roles?.includes(currentRole) &&
    groups?.includes(currentGroup)
  ) {
    return children;
  } else {
    return <div>404</div>;
  }
}
