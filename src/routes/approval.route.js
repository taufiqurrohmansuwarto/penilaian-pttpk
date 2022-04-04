import {
    DashboardOutlined,
    FundOutlined,
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
            path: "/approval/penilaian",
            name: " Penilaian",
            icon: <RadarChartOutlined />
        }
    ]
};
