import dynamic from "next/dynamic";
import userRoute from "../routes/user.route";

const ProLayout = dynamic(() => import("@ant-design/pro-layout"), {
    ssr: false
});

const PageContainer = dynamic(
    () => import("@ant-design/pro-layout").then((m) => m?.PageContainer),
    {
        ssr: false
    }
);

const UserLayout = ({ children }) => {
    return (
        <ProLayout
            collapsed
            route={userRoute}
            location="/"
            collapsedButtonRender={false}
            navTheme="dark"
            style={{ minHeight: "100vh" }}
            fixSiderbar
            disableContentMargin
        >
            <PageContainer>{children}</PageContainer>
        </ProLayout>
    );
};

export default UserLayout;
