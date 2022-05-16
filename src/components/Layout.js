import {
    InteractionOutlined,
    LogoutOutlined,
    ReadOutlined,
    UserOutlined,
    VerifiedOutlined
} from "@ant-design/icons";
import { Avatar, Dropdown, Menu, Space, Tooltip } from "antd";
import { uniqBy } from "lodash";
import { signIn, signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import routes from "../routes/routes";
import BadgeMail from "./BadgeMail";
import BadgeNotificationForum from "./BadgeNotificationForum";
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

const menuUser = (gotoAccount) => (
    <Menu>
        <Menu.Item key="account" onClick={gotoAccount} icon={<UserOutlined />}>
            Account
        </Menu.Item>
        <Menu.Item key="logout" onClick={signOut} icon={<LogoutOutlined />}>
            Logout
        </Menu.Item>
    </Menu>
);

const rightContentRender = (user) => {
    const router = useRouter();

    const gotoNotificationPage = () => {
        router.push(`/notifications/feedbacks`);
    };

    const gotoNotificationDiscussions = () => {
        router.push(`/notifications/discussions`);
    };

    const gotoAccount = () => {
        router.push(`/account/${user?.id}`);
    };

    const goMails = () => {
        router.push("/mails/inbox");
    };

    const gotoAktivitas = () => {
        router.push("/activities");
    };

    return (
        <Space size="large">
            <Space
                align="center"
                style={{ cursor: "pointer" }}
                onClick={gotoAktivitas}
            >
                <Tooltip title="Aktivitas">
                    <InteractionOutlined />
                </Tooltip>
            </Space>
            <Space
                align="center"
                style={{ cursor: "pointer" }}
                onClick={gotoNotificationDiscussions}
            >
                <BadgeNotificationForum />
            </Space>

            <Space
                align="center"
                style={{ cursor: "pointer" }}
                onClick={gotoNotificationPage}
            >
                <BadgeNotifications />
            </Space>

            <Space
                align="center"
                style={{ cursor: "pointer" }}
                onClick={goMails}
            >
                <BadgeMail />
            </Space>

            <Dropdown overlay={menuUser(gotoAccount)}>
                <Space align="center">
                    <Avatar
                        // shape="square"
                        size="small"
                        style={{ cursor: "pointer" }}
                        src={user?.image}
                    />
                    {/* <Typography.Text strong>{user?.name}</Typography.Text> */}
                </Space>
            </Dropdown>
        </Space>
    );
};

const changeRoutes = (user) => {
    return new Promise((resolve, reject) => {
        const role = user?.role;
        const group = user?.group;
        const id = user?.id;
        const userPtt = role === "USER" && group === "PTTPK";
        const userMaster = role === "USER" && group === "MASTER";
        const userPttFasilitator = role === "FASILITATOR" && group === "PTTPK";
        const isAdmin = id === "master|56543";

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

        const adminRoutes = [
            {
                path: "/admin/dashboard",
                name: " Admin",
                icon: <VerifiedOutlined />
            }
        ];

        let currentRoutes = routes?.routes;

        if (userMaster) {
            currentRoutes.push(...userMasterRoutes);
        }
        if (userPtt) {
            currentRoutes.push(...userPttpkRoutes);
        }
        if (userPttFasilitator) {
            currentRoutes.push(...fasilitatorRoutes);
        }
        if (isAdmin) {
            currentRoutes.push(...adminRoutes);
        }

        resolve(uniqBy(currentRoutes, "path"));
    });
};

const Layout = ({ children, disableContentMargin = false }) => {
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
            title="BKD JATIM"
            fixedHeader
            selectedKeys={[active]}
            menuItemRender={menuItemRender}
            theme="dark"
            rightContentRender={() => rightContentRender(data?.user)}
            navTheme="dark"
            fixSiderbar
            disableContentMargin={disableContentMargin}
        >
            {children}
        </ProLayout>
    );
};

export default Layout;
