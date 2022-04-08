import { Button, Divider } from "antd";
import { useRouter } from "next/router";
import Layout from "../../src/components/Layout";
import CreatePostAndCommunities from "../../src/components/reddits/Cards/CreatePostAndCommunities";
import RecentPost from "../../src/components/reddits/Cards/RecentPost";
import TopCommunities from "../../src/components/reddits/Cards/TopCommunities";

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
            <Button onClick={gotoCreatePost}>Create Posts</Button>
            <Button onClick={gotoCreateKomunitas}>Create Komunitas</Button>
            <Divider />
            <CreatePostAndCommunities />
            <Divider />
            <RecentPost />
            <Divider />
            <TopCommunities />
        </Layout>
    );
};

export default Discussions;
