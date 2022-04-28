import { NotificationOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import { useQuery } from "react-query";
import { getNotificationDiscussions } from "../../services/main.services";

function BadgeNotificationForum() {
    const { data } = useQuery(["notifications-discussions"], () =>
        getNotificationDiscussions()
    );

    return (
        <Badge dot={data?.total !== 0}>
            <NotificationOutlined />
        </Badge>
    );
}

export default BadgeNotificationForum;
