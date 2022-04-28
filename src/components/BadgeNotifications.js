import { BellOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import { useQuery } from "react-query";
import { getNotifications } from "../../services/main.services";

function BadgeNotifications() {
    const { data } = useQuery(["notifications-feedbacks"], () =>
        getNotifications()
    );

    return (
        <Badge size="small" dot={data?.total !== 0}>
            <BellOutlined />
        </Badge>
    );
}

export default BadgeNotifications;
