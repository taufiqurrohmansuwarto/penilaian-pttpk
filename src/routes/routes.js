import {
    CommentOutlined,
    ShareAltOutlined,
    TeamOutlined
} from "@ant-design/icons";

export default {
    routes: [
        {
            path: "/feeds",
            name: " Beranda",
            icon: <ShareAltOutlined />
        },
        {
            path: "/question-answer",
            name: " Tanya Jawab",
            icon: <TeamOutlined />
        },
        {
            path: "/discussions",
            name: " Diskusi",
            icon: <CommentOutlined />
        }
    ]
};
