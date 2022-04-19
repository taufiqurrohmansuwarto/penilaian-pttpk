import { LogoutOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Menu, Space, Typography } from "antd";
import { signIn, signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import fasilitatorRoute from "../routes/fasilitator.route";

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

const menuUser = () => (
    <Menu>
        <Menu.Item key="logout" onClick={signOut} icon={<LogoutOutlined />}>
            Logout
        </Menu.Item>
    </Menu>
);

const rightContentRender = (user) => {
    return (
        <Dropdown overlay={menuUser()}>
            <Space align="center">
                <Avatar style={{ cursor: "pointer" }} src={user?.image} />
                <Typography.Text strong>{user?.name}</Typography.Text>
            </Space>
        </Dropdown>
    );
};

const ApprovalLayout = ({ children, title = "" }) => {
    const { data } = useSession({
        required: true,
        onUnauthenticated: () => signIn()
    });

    const router = useRouter();
    const active = `/${router?.asPath?.split("/")?.[1]}`;

    return (
        <ProLayout
            menuItemRender={menuItemRender}
            collapsed
            selectedKeys={[active]}
            title="PTTPK"
            logo="https://gw.alipayobjects.com/mdn/rms_b5fcc5/afts/img/A*1NHAQYduQiQAAAAAAAAAAABkARQnAQ"
            menuHeaderRender={(logo, title) => {
                return <Link href="/">{logo}</Link>;
            }}
            rightContentRender={() => rightContentRender(data?.user)}
            route={fasilitatorRoute}
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
