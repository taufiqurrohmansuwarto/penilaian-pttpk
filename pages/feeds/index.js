import { Button, Card, Col, Row } from "antd";
import { signOut } from "next-auth/react";
import Layout from "../../src/components/Layout";
import UserComments from "../../src/components/UsersComments";

const Feeds = () => {
    return (
        <Layout>
            <Row gutter={16}>
                <Col span={6}></Col>
                <Col span={12}>
                    <Card>
                        <Button onClick={signOut}>signout</Button>
                        <UserComments />
                    </Card>
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
