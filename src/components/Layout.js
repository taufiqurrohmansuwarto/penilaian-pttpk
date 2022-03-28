import { signIn, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import userRoute from "../routes/routes";

const ProLayout = dynamic(() => import("@ant-design/pro-layout"), {
    ssr: false
});

const menuItemRender = (options, element) => {
    return (
        <Link href={`${options.path}`}>
            <a>{element}</a>
        </Link>
    );
};

const PageContainer = dynamic(
    () => import("@ant-design/pro-layout").then((m) => m?.PageContainer),
    {
        ssr: false
    }
);

const routes = (route, user) => {};

const Layout = ({ children }) => {
    const { data, status } = useSession({
        required: true,
        onUnauthenticated: () => signIn()
    });

    return (
        <ProLayout
            loading={status === "loading"}
            menuItemRender={menuItemRender}
            collapsed
            route={userRoute}
            collapsedButtonRender={false}
            navTheme="dark"
            style={{ minHeight: "100vh" }}
            fixSiderbar
            disableContentMargin
        >
            <PageContainer title="Feeds">{children}</PageContainer>
        </ProLayout>
    );
};

export default Layout;
