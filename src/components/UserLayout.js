import dynamic from "next/dynamic";

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
            collapsedButtonRender={false}
            style={{ minHeight: "100vh" }}
            fixSiderbar
        >
            <PageContainer content="test">{children}</PageContainer>
        </ProLayout>
    );
};

export default UserLayout;
