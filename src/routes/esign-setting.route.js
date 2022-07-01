import {
    CheckSquareOutlined,
    ClockCircleOutlined,
    FolderOpenOutlined,
    UnorderedListOutlined
} from "@ant-design/icons";

export default {
    routes: [
        {
            path: "/esign/settings/activity-logs",
            name: " Activities",
            icon: <FolderOpenOutlined />
        },
        {
            path: "/esign/settings/personal-information",
            name: " Personal Information",
            icon: <UnorderedListOutlined />
        },
        {
            path: "/esign/settings/faq",
            name: " FAQ",
            icon: <ClockCircleOutlined />
        },
        {
            path: "/esign/settings/signature",
            name: " Signature",
            icon: <CheckSquareOutlined />
        }
    ]
};
