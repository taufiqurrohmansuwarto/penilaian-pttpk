import "@ant-design/pro-layout/dist/layout.css";
import { ConfigProvider, Spin } from "antd";
import "antd/dist/antd.css";
import id from "antd/lib/locale/id_ID";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import "semantic-ui-css/semantic.min.css";
import "./index.css";
import { RouterScrollProvider } from "@moxy/next-router-scroll";
import { MantineProvider } from "@mantine/core";

export default function MyApp({
    Component,
    pageProps: { session, ...pageProps },
    router
}) {
    // useScrollRestoration(router);
    const [queryClient] = useState(() => new QueryClient());
    const getLayout = Component.getLayout || ((page) => page);

    return (
        <SessionProvider
            basePath="/pttpk-penilaian/api/auth"
            baseUrl="/pttpk-penilaian"
            session={session}
        >
            <QueryClientProvider client={queryClient}>
                <ConfigProvider locale={id}>
                    <MantineProvider
                        withGlobalStyles
                        withNormalizeCSS
                        theme={{
                            /** Put your mantine theme override here */
                            colorScheme: "light"
                        }}
                    >
                        <Hydrate state={pageProps?.dehydrateState}>
                            <RouterScrollProvider disableNextLinkScroll={false}>
                                {Component.Auth ? (
                                    <Auth
                                        roles={Component?.Auth?.roles}
                                        groups={Component?.Auth?.groups}
                                    >
                                        {getLayout(
                                            <Component {...pageProps} />
                                        )}
                                    </Auth>
                                ) : (
                                    <Component {...pageProps} />
                                )}
                            </RouterScrollProvider>
                        </Hydrate>
                    </MantineProvider>
                </ConfigProvider>
            </QueryClientProvider>
        </SessionProvider>
    );
}

function Auth({ children, roles, groups }) {
    const { data, status } = useSession({
        required: true,
        onUnauthenticated: () => signIn()
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
