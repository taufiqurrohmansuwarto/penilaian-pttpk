import { Button, Card, Avatar } from "antd";
import UserLayout from "../../src/components/UserLayout";
import {
    EditOutlined,
    EllipsisOutlined,
    SettingOutlined
} from "@ant-design/icons";
import Layout from "../../src/components/Layout";
import DiscussionsFeeds from "../../src/components/DiscussionsFeeds";
import { useRouter } from "next/router";
import CreatePost from "../../src/components/reddits/CreatePost";
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
    const router = useRouter();

    const gotoCreatePost = () => {
        router.push("/discussions/submit");
    };

    const gotoCreateKomunitas = () => {
        router.push("/discussions/komunitas/create");
    };

    return (
        <Layout>
            <CreatePost />
            <Button onClick={gotoCreatePost}>Create Posts</Button>
            <Button onClick={gotoCreateKomunitas}>Create Komunitas</Button>
        </Layout>
    );
};

export default Discussions;
