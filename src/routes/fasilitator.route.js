import { DashboardOutlined, RadarChartOutlined } from "@ant-design/icons";

export default {
    routes: [
        {
            path: "/fasilitator/dashboard",
            name: " Dashboard",
            icon: <DashboardOutlined />
        },
        {
            path: "/fasilitator/penilaian-bulanan",
            name: " Penilaian",
            icon: <RadarChartOutlined />
        }
    ]
};
