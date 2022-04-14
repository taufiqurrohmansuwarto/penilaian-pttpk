import { Avatar, Card, Divider, Space } from "antd";

function CardCommunitiesDescription({
    title,
    description,
    avatar,
    totalUserJoined
}) {
    const Title = () => (
        <Space>
            <Avatar size="large" />
            <span>{title}</span>
        </Space>
    );

    return (
        <Card>
            <Card.Meta
                title={title}
                description={description}
                avatar={<Avatar />}
            />
            <Divider />
        </Card>
    );
}

export default CardCommunitiesDescription;
