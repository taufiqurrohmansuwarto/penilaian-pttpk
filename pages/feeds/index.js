import { Col, Row } from "antd";
import Layout from "../../src/components/Layout";
import PageContainer from "../../src/components/PageContainer";
import UserComments from "../../src/components/UsersComments";

const Feeds = ({ data }) => {
    return (
        <Layout>
            <PageContainer subTitle="Feedback" fixedHeader>
                <Row>
                    <Col span={4}></Col>
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
    const sort = ctx?.query?.sort || "like";
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
