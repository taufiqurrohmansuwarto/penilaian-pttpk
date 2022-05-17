import {
    DashboardOutlined,
    FieldTimeOutlined,
    LineChartOutlined,
    UserOutlined
} from "@ant-design/icons";

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
            icon: <LineChartOutlined />
        },
        {
            path: "/admin/announcements",
            name: " Pengumuman",
            icon: <FieldTimeOutlined />
        },
        {
            path: "/admin/referensi",
            name: " Referensi",
            icon: <UserOutlined />
        }
    ]
};
