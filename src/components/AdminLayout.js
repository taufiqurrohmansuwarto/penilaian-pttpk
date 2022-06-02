import { LogoutOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Menu, Space, Typography } from "antd";
import { signIn, signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import adminRoute from "../routes/admin.route";

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
                {/* <Typography.Text strong>{user?.name}</Typography.Text> */}
            </Space>
        </Dropdown>
    );
};

const AdminLayout = ({ children }) => {
    const { data } = useSession({
        required: true,
        onUnauthenticated: () => signIn()
    });

    const router = useRouter();
    const active = `${router?.pathname}`;

    return (
        <ProLayout
            menuItemRender={menuItemRender}
            selectedKeys={[active]}
            logo="https://gw.alipayobjects.com/mdn/rms_b5fcc5/afts/img/A*1NHAQYduQiQAAAAAAAAAAABkARQnAQ"
            title="Admin "
            menuHeaderRender={(logo, title) => {
                return <Link href="/">{logo}</Link>;
            }}
            rightContentRender={() => rightContentRender(data?.user)}
            route={adminRoute}
            navTheme="light"
            fixedHeader
            fixSiderbar
            disableContentMargin
        >
            {children}
        </ProLayout>
    );
};

export default AdminLayout;
