import {
    BookOutlined,
    DashboardOutlined,
    RadarChartOutlined
} from "@ant-design/icons";

export default {
    routes: [
        {
            path: "/fasilitator/dashboard",
            name: " Dashboard",
            icon: <DashboardOutlined />
        },
        {
            path: "/fasilitator/penilaian-bulanan",
            name: " Penilaian Bulanan",
            icon: <RadarChartOutlined />
        },
        {
            path: "/fasilitator/penilaian-tahunan",
            name: " Penilaian Tahunan",
            icon: <BookOutlined />
        }
        // {
        //     path: "/fasilitator/data-satuan-kinerja",
        //     name: " Data Satuan Kinerja",
        //     icon: <DatabaseOutlined />
        // }
    ]
};
