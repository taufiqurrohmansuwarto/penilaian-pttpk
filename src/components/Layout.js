import { LogoutOutlined, ReadOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Menu, Space, Typography } from "antd";
import { xorBy } from "lodash";
import { signIn, signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import routes from "../routes/routes";
import BadgeNotifications from "./BadgeNotifications";

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
    const router = useRouter();

    const gotoNotificationPage = () => {
        router.push(`/notifications`);
    };

    return (
        <Space size="large">
            <Space
                align="center"
                style={{ cursor: "pointer" }}
                onClick={gotoNotificationPage}
            >
                <BadgeNotifications />
            </Space>

            <Dropdown overlay={menuUser()}>
                <Space align="center">
                    <Avatar
                        shape="square"
                        size="small"
                        style={{ cursor: "pointer" }}
                        src={user?.image}
                    />
                    <Typography.Text strong>{user?.name}</Typography.Text>
                </Space>
            </Dropdown>
        </Space>
    );
};

const changeRoutes = (user) => {
    return new Promise((resolve, reject) => {
        const role = user?.role;
        const group = user?.group;
        const userPtt = role === "USER" && group === "PTTPK";
        const userMaster = role === "USER" && group === "MASTER";
        const userPttFasilitator = role === "FASILITATOR" && group === "PTTPK";

        const userMasterRoutes = [
            {
                path: "/approval/dashboard",
                name: " Penilaian PTTPK",
                icon: <ReadOutlined />
            }
        ];

        const userPttpkRoutes = [
            {
                path: "/user/dashboard",
                name: " Penilaian PTTPK",
                icon: <ReadOutlined />
            }
        ];

        const fasilitatorRoutes = [
            {
                path: "/fasilitator/dashboard",
                name: " Penilaian PTTPK",
                icon: <ReadOutlined />
            }
        ];

        if (userMaster) {
            resolve(xorBy(routes?.routes, userMasterRoutes, "name"));
        } else if (userPtt) {
            resolve(xorBy(routes?.routes, userPttpkRoutes, "name"));
        } else if (userPttFasilitator) {
            resolve(xorBy(routes?.routes, fasilitatorRoutes, "name"));
        }
    });
};

const Layout = ({ children }) => {
    const { data } = useSession({
        required: true,
        onUnauthenticated: () => signIn()
    });

    const router = useRouter();
    const active = router?.pathname;

    return (
        <ProLayout
            menu={{
                defaultOpenAll: false,
                request: async () => {
                    try {
                        const user = await changeRoutes(data?.user);
                        return user;
                    } catch (e) {
                        console.log(e);
                    }
                }
            }}
            title="Apps"
            fixedHeader
            selectedKeys={[active]}
            menuItemRender={menuItemRender}
            theme="light"
            // collapsed
            rightContentRender={() => rightContentRender(data?.user)}
            collapsedButtonRender={false}
            navTheme="dark"
            style={{ minHeight: "100vh" }}
            fixSiderbar
            disableContentMargin
        >
            {children}
        </ProLayout>
    );
};

export default Layout;
