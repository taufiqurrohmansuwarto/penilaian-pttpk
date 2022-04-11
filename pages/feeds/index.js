import { Card, Col, List, Row } from "antd";
import Layout from "../../src/components/Layout";
import UserComments from "../../src/components/UsersComments";

const Feeds = () => {
    return (
        <Layout>
            <Row gutter={32}>
                <Col span={6}></Col>
                <Col span={12}>
                    <UserComments />
                </Col>
                <Col span={6}></Col>
            </Row>
        </Layout>
    );
};

Feeds.auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["PTTPK", "MASTER"]
};

export default Feeds;
