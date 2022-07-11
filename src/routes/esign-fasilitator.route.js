import { DashboardOutlined, FormOutlined } from "@ant-design/icons";

export default {
    routes: [
        {
            path: "/fasilitator-master/esign/dashboard",
            name: " Dashboard",
            icon: <DashboardOutlined />
        },
        {
            path: "/fasilitator-master/esign/request",
            name: " Permohonan Dokumen Kolektif",
            icon: <FormOutlined />
        }
    ]
};
