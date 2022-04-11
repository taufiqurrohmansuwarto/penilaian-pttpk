import { Card, Col, Row } from "antd";
import { useRouter } from "next/router";
import Layout from "../../../../src/components/Layout";
import Communities from "../../../../src/components/reddits/Communities";
import CreatePost from "../../../../src/components/reddits/CreatePost";

const SubCategories = () => {
    const { query } = useRouter();

    return (
        <Layout title={`Komunitas ${query?.sub}`}>
            <Row gutter={[10, 10]}>
                <Col span={6}></Col>
                <Col span={12}>
                    <Card style={{ marginBottom: 8 }}>
                        <CreatePost
                            route={`/discussions/r/${query?.sub}/submit`}
                        />
                    </Card>
                </Col>
                <Col span={6}></Col>
            </Row>
            <Communities />
        </Layout>
    );
};

SubCategories.auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["PTTPK", "MASTER"]
};

export default SubCategories;
