import {
    BellOutlined,
    CommentOutlined,
    MessageOutlined
} from "@ant-design/icons";

export default {
    routes: [
        {
            path: "/feeds",
            name: " Feedback",
            icon: <MessageOutlined />
        },
        {
            path: "/discussions",
            name: " Diskusi",
            icon: <CommentOutlined />
        },
        {
            path: "/notifications",
            name: " Notifikasi",
            icon: <BellOutlined />
        }
    ]
};
