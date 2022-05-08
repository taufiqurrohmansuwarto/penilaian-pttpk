import {
    CommentOutlined,
    MailOutlined,
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
            path: "/discussions",
            name: " Diskusi",
            icon: <CommentOutlined />
        },
        {
            path: "/question-answer",
            name: " Tanya Jawab",
            icon: <TeamOutlined />
        },
        {
            path: "/mails/inbox",
            name: " Pesan",
            icon: <MailOutlined />
        }
    ]
};
