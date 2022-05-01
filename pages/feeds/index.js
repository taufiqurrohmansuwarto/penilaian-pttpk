import { Alert, Col, Row } from "antd";
import Layout from "../../src/components/Layout";
import PageContainer from "../../src/components/PageContainer";
import TopDiscussions from "../../src/components/reddits/Cards/TopDiscussions";
import UserComments from "../../src/components/UsersComments";

const Feeds = ({ data }) => {
    return (
        <PageContainer title="Apps" subTitle="Feedback">
            <Row>
                <Col lg={24} xs={24} style={{ marginBottom: 10 }}>
                    <Alert
                        type="info"
                        showIcon
                        message="Perhatian"
                        description="Dikarenakan ada pergantian database maka penilaian dientri ulang kembali mulai bulan januari sampai maret"
                    />
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col lg={{ span: 12, offset: 4 }} xs={{ span: 24 }}>
                    <UserComments sort={data?.sort} />
                </Col>
                <Col lg={{ span: 6 }} xs={{ span: 24 }}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <TopDiscussions />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </PageContainer>
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

Feeds.Auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["PTTPK", "MASTER"]
};

Feeds.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default Feeds;
