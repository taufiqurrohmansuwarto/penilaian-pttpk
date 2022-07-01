import {
    BookOutlined,
    CheckSquareOutlined,
    ClockCircleOutlined,
    CloseSquareOutlined,
    DashboardOutlined,
    FieldTimeOutlined,
    FileOutlined,
    FolderOpenOutlined,
    SettingOutlined,
    UnorderedListOutlined
} from "@ant-design/icons";

export default {
    routes: [
        {
            path: "/esign/dashboard",
            name: " Dashboard",
            icon: <DashboardOutlined />
        },

        {
            path: "/esign/documents",
            name: " Documents",
            icon: <FileOutlined />,
            routes: [
                {
                    path: "/esign/documents/list/all",
                    name: "All Documents",
                    icon: <UnorderedListOutlined />
                },
                {
                    path: "/esign/documents/list/draft",
                    name: "Draft",
                    icon: <FolderOpenOutlined />
                },
                {
                    path: "/esign/documents/list/pending",
                    name: "Pending",
                    icon: <ClockCircleOutlined />
                },
                {
                    path: "/esign/documents/list/done",
                    name: "Done",
                    icon: <CheckSquareOutlined />
                },
                {
                    path: "/esign/documents/list/expired",
                    name: "Expired",
                    icon: <FieldTimeOutlined />
                },
                {
                    path: "/esign/documents/list/archieved",
                    name: "Archieved",
                    icon: <BookOutlined />
                },
                {
                    path: "/esign/documents/list/rejected",
                    name: "Rejected",
                    icon: <CloseSquareOutlined />
                }
            ]
        },
        {
            path: "/esign/settings/activity-logs",
            name: " Settings",
            icon: <SettingOutlined />
        }
    ]
};
