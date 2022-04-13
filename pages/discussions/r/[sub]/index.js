import { Card, Col, Divider, Row, Skeleton } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { getPostsByCommunities } from "../../../../services/main.services";
import Layout from "../../../../src/components/Layout";
import Posts from "../../../../src/components/reddits/Cards/Posts";
import CreatePost from "../../../../src/components/reddits/CreatePost";

const SubCategories = () => {
    const router = useRouter();
    const { query } = router;

    const { data, isLoading } = useQuery(
        ["post-communities", query?.sub],
        () => getPostsByCommunities(query?.sub),
        {
            enabled: !!query?.sub
        }
    );

    useEffect(() => {
        if (!router?.isReady) null;
    }, [router?.query]);

    return (
        <Layout title={`Komunitas ${query?.sub}`}>
            <Row gutter={[10, 10]}>
                <Col span={7}></Col>
                <Col span={10}>
                    <Card style={{ marginBottom: 8 }}>
                        <CreatePost
                            route={`/discussions/r/${query?.sub}/submit`}
                        />
                    </Card>
                    <Divider />
                    <Skeleton loading={isLoading}>
                        <Posts data={data} loading={isLoading} />
                    </Skeleton>
                </Col>
                <Col span={7}></Col>
            </Row>
        </Layout>
    );
};

SubCategories.auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["PTTPK", "MASTER"]
};

export default SubCategories;
