import { Card, Col, Row } from "antd";
import ChatLayout from "../../src/components/chats/ChatLayout";
import Layout from "../../src/components/Layout";
import PageContainer from "../../src/components/PageContainer";

const Index = () => {
    return (
        <PageContainer
            title="Group Chat"
            subTitle="Masih Beta"
            style={{ minHeight: "92vh" }}
        >
            <Row>
                <Col span={3}>
                    <ChatLayout />
                </Col>
                <Col span={21}>
                    <Card>chat</Card>
                </Col>
            </Row>
        </PageContainer>
    );
};

Index.Auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["PTTPK", "MASTER"]
};

Index.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default Index;
