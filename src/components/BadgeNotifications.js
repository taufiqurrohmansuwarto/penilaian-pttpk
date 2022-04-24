import { BellOutlined } from "@ant-design/icons";
import { Avatar, Badge, Skeleton } from "antd";
import { useQuery } from "react-query";

function BadgeNotifications() {
    const { data, isLoading } = useQuery(["notifications"], () =>
        getNotifications()
    );

    return (
        <Badge size="small" dot={isLoading ? true : false} count={data?.total}>
            <Avatar size="small" shape="square" icon={<BellOutlined />} />
        </Badge>
    );
}

export default BadgeNotifications;
