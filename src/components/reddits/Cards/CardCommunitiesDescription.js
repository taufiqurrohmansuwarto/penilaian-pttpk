import { Avatar, Card, Space } from "antd";

function CardCommunitiesDescription() {
    const Title = () => (
        <Space>
            <Avatar size="large" />
            <span>Hello world</span>
        </Space>
    );

    return (
        <Card>
            <Card.Meta title={<Title />} description="merupakan deskripsi" />
        </Card>
    );
}

export default CardCommunitiesDescription;
