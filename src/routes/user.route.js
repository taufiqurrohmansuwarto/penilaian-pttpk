import { CiOutlined, DashboardOutlined } from "@ant-design/icons";

export default {
    routes: [
        {
            path: "/dashboard",
            name: " Dashboard",
            icon: <DashboardOutlined />
        },
        {
            path: "/resume",
            name: " Resume",
            icon: <CiOutlined />
        }
    ]
};
