import { Alert, Card, Col, Row } from "antd";
import Layout from "../../src/components/Layout";
import PageContainer from "../../src/components/PageContainer";
import TopCommunities from "../../src/components/reddits/Cards/TopCommunities";
import TopDiscussions from "../../src/components/reddits/Cards/TopDiscussions";
import UserComments from "../../src/components/UsersComments";

const Feeds = ({ data }) => {
    return (
        <Layout>
            <PageContainer subTitle="Feedback" fixedHeader>
                <Row>
                    <Col span={14} offset={2} style={{ marginBottom: 10 }}>
                        <Alert
                            type="info"
                            showIcon
                            message="Perhatian"
                            description="Dikarenakan ada pergantian database maka penilaian dientri ulang kembali mulai bulan januari sampai maret"
                        />
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={16} offset={2}>
                        <UserComments sort={data?.sort} />
                    </Col>
                    <Col span={6}>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <TopDiscussions />
                            </Col>
                            <Col span={24}>
                                <TopCommunities />
                            </Col>
                        </Row>
                    </Col>
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
