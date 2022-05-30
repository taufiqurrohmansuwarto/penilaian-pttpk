import {
    CommentOutlined,
    FundViewOutlined,
    MessageOutlined,
    ShareAltOutlined,
    TeamOutlined
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
            path: "/online-chat",
            name: " Online Chat",
            icon: <MessageOutlined />
        },
        {
            path: "/tutorial",
            name: " Tutorial Penilaian",
            icon: <FundViewOutlined />,
            children: [
                {
                    path: "/tutorial/pttpk",
                    name: "PTT-PK"
                },
                {
                    path: "/tutorial/penilai",
                    name: " Penilai"
                },
                {
                    path: "/tutorial/fasilitator",
                    name: " Fasilitator"
                }
            ]
        }
        // {
        //     path: "/question-answer",
        //     name: " Hari ini",
        //     icon: <TeamOutlined />
        // }
    ]
};
