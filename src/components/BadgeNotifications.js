import { BellOutlined } from "@ant-design/icons";
import { Badge, Tooltip } from "antd";
import { useQuery } from "react-query";
import { getNotifications } from "../../services/main.services";

function BadgeNotifications() {
    const { data } = useQuery(["notifications-feedbacks"], () =>
        getNotifications()
    );

    return (
        <Tooltip title="Notifikasi Komentar">
            <Badge size="small" dot={data?.total !== 0}>
                <BellOutlined />
            </Badge>
        </Tooltip>
    );
}

export default BadgeNotifications;
