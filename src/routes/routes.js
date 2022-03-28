import {
    CommentOutlined,
    DashboardOutlined,
    MessageOutlined
} from "@ant-design/icons";

export default {
    routes: [
        {
            path: "/feeds",
            name: " Feeds",
            icon: <MessageOutlined />
        },
        {
            path: "/discussions",
            name: " Discussions",
            icon: <CommentOutlined />
        }
    ]
};
