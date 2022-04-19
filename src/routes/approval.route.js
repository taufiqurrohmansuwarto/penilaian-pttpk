import {
    DashboardOutlined,
    DatabaseOutlined,
    RadarChartOutlined
} from "@ant-design/icons";

export default {
    routes: [
        {
            path: "/approval/dashboard",
            name: " Dashboard",
            icon: <DashboardOutlined />
        },
        {
            path: "/approval/penilaian-bulanan",
            name: " Penilaian Bulanan",
            icon: <RadarChartOutlined />
        },
        {
            path: "/approval/penilaian-tahunan",
            name: " Penilaian Tahunan",
            icon: <DatabaseOutlined />
        }
    ]
};
