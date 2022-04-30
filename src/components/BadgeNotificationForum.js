import { NotificationOutlined } from "@ant-design/icons";
import { Badge, Tooltip } from "antd";
import { useQuery } from "react-query";
import { getNotificationDiscussions } from "../../services/main.services";

function BadgeNotificationForum() {
    const { data } = useQuery(["notifications-discussions"], () =>
        getNotificationDiscussions()
    );

    return (
        <Tooltip title="Notifikasi Diskusi">
            <Badge dot={data?.total !== 0}>
                <NotificationOutlined />
            </Badge>
        </Tooltip>
    );
}

export default BadgeNotificationForum;
