import { Col, Divider, Row } from "antd";
import FeaturesNotWell from "../../src/components/FeaturesNotWell";
import Layout from "../../src/components/Layout";
import PageContainer from "../../src/components/PageContainer";
import UserComments from "../../src/components/UsersComments";

const Feeds = ({ data }) => {
    return (
        <Layout>
            <PageContainer
                title="Beta Features"
                fixedHeader
                content={
                    <>
                        <FeaturesNotWell />
                    </>
                }
            >
                <Row gutter={32}>
                    <Col span={6}></Col>
                    <Col span={12}>
                        <UserComments sort={data?.sort} />
                    </Col>
                    <Col span={6}></Col>
                </Row>
            </PageContainer>
        </Layout>
    );
};

export const getServerSideProps = async (ctx) => {
    const sort = ctx?.query?.sort || "terbaru";
    return {
        props: {
            data: {
                sort
            }
        }
    };
};

Feeds.auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["PTTPK", "MASTER"]
};

export default Feeds;
