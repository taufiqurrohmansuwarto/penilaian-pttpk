import { NotificationOutlined } from "@ant-design/icons";
import { Avatar, Badge } from "antd";

function BadgeNotificationForum() {
    return (
        <Badge>
            <Avatar
                size="small"
                shape="square"
                icon={<NotificationOutlined />}
            />
        </Badge>
    );
}

export default BadgeNotificationForum;
