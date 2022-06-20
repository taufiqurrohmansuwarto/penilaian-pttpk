import {
    CommentOutlined,
    FundViewOutlined,
    ShareAltOutlined,
    UserAddOutlined
} from "@ant-design/icons";

export default {
    routes: [
        {
            path: "/feeds",
            name: " Berbagi",
            icon: <ShareAltOutlined />
        },
        {
            path: "/discussions",
            name: " Forum",
            icon: <CommentOutlined />
        },
        {
            path: "/tutorial",
            name: " Tutorial Penilaian",
            icon: <FundViewOutlined />,
            routes: [
                {
                    path: "/tutorial/pttpk",
                    name: " PTT-PK",
                    icon: <UserAddOutlined />
                },
                {
                    path: "/tutorial/penilai",
                    name: " Penilai",
                    icon: <UserAddOutlined />
                },
                {
                    path: "/tutorial/fasilitator",
                    name: " Fasilitator",
                    icon: <UserAddOutlined />
                }
            ]
        }
    ]
};
