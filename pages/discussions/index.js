import { Col, Row } from "antd";
import { useQuery } from "react-query";
import { getPosts } from "../../services/main.services";
import Layout from "../../src/components/Layout";
import CardRules from "../../src/components/reddits/Cards/CardRules";
import CreatePostAndCommunities from "../../src/components/reddits/Cards/CreatePostAndCommunities";
import Posts from "../../src/components/reddits/Cards/Posts";

const Discussions = () => {
    const { data: dataPosts, isLoading: loadingDataPosts } = useQuery(
        ["posts"],
        () => getPosts()
    );

    return (
        <Layout>
            <Row gutter={32}>
                <Col span={7}></Col>
                <Col span={10}>
                    <Posts data={dataPosts} loading={loadingDataPosts} />
                </Col>
                <Col span={7}>
                    <Row gutter={[8, 8]}>
                        <Col>
                            <CreatePostAndCommunities />
                        </Col>
                        <Col>
                            <CardRules />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Layout>
    );
};

Discussions.auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["MASTER", "PTTPK"]
};

export default Discussions;
