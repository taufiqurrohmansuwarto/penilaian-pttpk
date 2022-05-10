import {
    CommentOutlined,
    MailOutlined,
    ShareAltOutlined,
    TeamOutlined,
    UserSwitchOutlined
} from "@ant-design/icons";

export default {
    routes: [
        {
            path: "/feeds",
            name: " Beranda",
            icon: <ShareAltOutlined />
        },
        {
            path: "/activities",
            name: " Aktivitas",
            icon: <UserSwitchOutlined />
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
