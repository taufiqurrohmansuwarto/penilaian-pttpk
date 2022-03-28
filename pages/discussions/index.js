import { Card, Avatar } from "antd";
import UserLayout from "../../src/components/UserLayout";
import {
    EditOutlined,
    EllipsisOutlined,
    SettingOutlined
} from "@ant-design/icons";
import Layout from "../../src/components/Layout";
const { Meta } = Card;

const data = [
    {
        id: 1,
        title: "test",
        subreddit: "/whitepeople",
        created_at: new Date(),
        image: "test",
        likes: 30,
        total_comments: 30
    }
];

const Discussion = () => {
    return (
        <Layout>
            <Card
                style={{ width: 300 }}
                cover={
                    <img
                        alt="example"
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />
                }
                actions={[
                    <SettingOutlined key="setting" />,
                    <EditOutlined key="edit" />,
                    <EllipsisOutlined key="ellipsis" />
                ]}
            >
                <Meta
                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                    title="Card title"
                    description="This is the description"
                />
            </Card>
        </Layout>
    );
};

export default Discussion;
