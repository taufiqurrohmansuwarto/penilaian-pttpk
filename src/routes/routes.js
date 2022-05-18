import {
    CommentOutlined,
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
            name: " Diskusi",
            icon: <CommentOutlined />
        },
        {
            path: "/question-answer",
            name: " Hari ini",
            icon: <TeamOutlined />
        }
    ]
};
