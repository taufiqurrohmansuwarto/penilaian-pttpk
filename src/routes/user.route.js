import {
    ClockCircleOutlined,
    DashboardOutlined,
    FundOutlined,
    RadarChartOutlined
} from "@ant-design/icons";

export default {
    routes: [
        {
            path: "/user/dashboard",
            name: " Dashboard",
            icon: <DashboardOutlined />
        },
        {
            path: "/user/penilaian",
            name: " Penilaian",
            icon: <RadarChartOutlined />
        },
        {
            path: "/user/penilaian/bulanan-baru",
            name: " Penilaian Bulanan",
            icon: <FundOutlined />
        },
        {
            path: "/user/penilaian/penilaian-akhir",
            name: " Penilaian Akhir",
            icon: <ClockCircleOutlined />
        }
    ]
};
