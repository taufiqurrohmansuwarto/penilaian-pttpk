import { Row, Col, Card } from "antd";
import Layout from "../../src/components/Layout";
import UserComments from "../../src/components/UsersComments";

const Feeds = () => {
    return (
        <Layout>
            <Row gutter={16}>
                <Col span={5}></Col>
                <Col span={14}>
                    <Card>
                        <UserComments />
                    </Card>
                </Col>
                <Col span={5}></Col>
            </Row>
        </Layout>
    );
};

Feeds.auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["PTTPK", "MASTER"]
};

export default Feeds;
