import dynamic from "next/dynamic";
import userRoute from "../routes/user.route";
import Link from "next/link";

const ProLayout = dynamic(() => import("@ant-design/pro-layout"), {
    ssr: false
});

const PageContainer = dynamic(
    () => import("@ant-design/pro-layout").then((m) => m?.PageContainer),
    {
        ssr: false
    }
);

const menuItemRender = (options, element) => {
    return (
        <Link href={`${options.path}`}>
            <a>{element}</a>
        </Link>
    );
};

const UserLayout = ({ children, title = "" }) => {
    return (
        <ProLayout
            menuItemRender={menuItemRender}
            collapsed
            route={userRoute}
            location="/"
            collapsedButtonRender={false}
            navTheme="dark"
            style={{ minHeight: "100vh" }}
            fixSiderbar
            disableContentMargin
        >
            <PageContainer title={title}>{children}</PageContainer>
        </ProLayout>
    );
};

export default UserLayout;
