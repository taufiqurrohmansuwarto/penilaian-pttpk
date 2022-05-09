import { DashboardOutlined, DatabaseOutlined } from "@ant-design/icons";

export default {
    routes: [
        {
            path: "/admin/dashboard",
            name: " Dashboard",
            icon: <DashboardOutlined />
        },
        {
            path: "/admin/poolings",
            name: " Pooling",
            icon: <DatabaseOutlined />
        }
    ]
};
