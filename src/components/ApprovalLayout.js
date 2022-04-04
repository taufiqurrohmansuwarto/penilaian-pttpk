import dynamic from "next/dynamic";
import Link from "next/link";
import approvalRoute from "../routes/approval.route";

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

const ApprovalLayout = ({ children, title = "" }) => {
    return (
        <ProLayout
            menuItemRender={menuItemRender}
            collapsed
            route={approvalRoute}
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

export default ApprovalLayout;
