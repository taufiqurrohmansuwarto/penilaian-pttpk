import { Card, Avatar } from "antd";
import UserLayout from "../../src/components/UserLayout";
import {
    EditOutlined,
    EllipsisOutlined,
    SettingOutlined
} from "@ant-design/icons";
import Layout from "../../src/components/Layout";
import DiscussionsFeeds from "../../src/components/DiscussionsFeeds";
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

const Discussions = () => {
    return (
        <Layout>
            <DiscussionsFeeds />
        </Layout>
    );
};

export default Discussions;
