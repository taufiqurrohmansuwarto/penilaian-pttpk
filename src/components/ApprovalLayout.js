import { LogoutOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Menu, Space, Typography } from "antd";
import { signIn, signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
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
                <Avatar
                    size="small"
                    style={{ cursor: "pointer" }}
                    src={user?.image}
                />
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
    const active = `${router?.pathname}`;

    return (
        <ProLayout
            mode="horizontal"
            layout="side"
            menuItemRender={menuItemRender}
            selectedKeys={[active]}
            logo="https://gw.alipayobjects.com/mdn/rms_b5fcc5/afts/img/A*1NHAQYduQiQAAAAAAAAAAABkARQnAQ"
            menuHeaderRender={(logo, title) => {
                return <Link href="/">{logo}</Link>;
            }}
            rightContentRender={() => rightContentRender(data?.user)}
            route={approvalRoute}
            navTheme="dark"
            fixSiderbar
            fixedHeader
            disableContentMargin
        >
            {children}
        </ProLayout>
    );
};

export default ApprovalLayout;
