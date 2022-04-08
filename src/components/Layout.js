import { LogoutOutlined, ReadOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Menu, Space, Typography } from "antd";
import { xorBy } from "lodash";
import { signIn, signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import routes from "../routes/routes";

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
                <Avatar style={{ cursor: "pointer" }} src={user?.image} />
                <Typography.Text strong>{user?.name}</Typography.Text>
            </Space>
        </Dropdown>
    );
};

const PageContainer = dynamic(
    () => import("@ant-design/pro-layout").then((m) => m?.PageContainer),
    {
        ssr: false
    }
);

const changeRoutes = (user, status) => {
    return new Promise((resolve, reject) => {
        const role = user?.role;
        const group = user?.group;
        const userPtt = role === "USER" && group === "PTTPK";
        const userMaster = role === "USER" && group === "MASTER";
        const userPttFasilitator = role === "FASILITATOR" && group === "PTTPK";

        const userMasterRoutes = [
            {
                path: "/approval/dashboard",
                name: " Approval",
                icon: <ReadOutlined />
            }
        ];

        const userPttpkRoutes = [
            { path: "/user/dashboard", name: " User", icon: <ReadOutlined /> }
        ];

        if (userMaster) {
            // reading twice like shit
            resolve(xorBy(routes?.routes, userMasterRoutes, "name"));
        } else if (userPtt) {
            resolve(xorBy(routes?.routes, userPttpkRoutes, "name"));
        } else if (userPttFasilitator) {
            console.log("fasilitator");
        }
    });
};

const Layout = ({ children, title = "Feeds" }) => {
    const { data, status } = useSession({
        required: true,
        onUnauthenticated: () => signIn()
    });

    return (
        <ProLayout
            menu={{
                request: async () => {
                    const user = await changeRoutes(data?.user);
                    return user;
                }
            }}
            menuItemRender={menuItemRender}
            collapsed
            rightContentRender={() => rightContentRender(data?.user)}
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

export default Layout;
