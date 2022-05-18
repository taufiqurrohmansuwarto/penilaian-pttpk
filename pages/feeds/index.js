import { BackTop, Card, Col, Row } from "antd";
import Layout from "../../src/components/Layout";
import PoolingsCard from "../../src/components/Pools/PoolingsCard";
import TopDiscussions from "../../src/components/reddits/Cards/TopDiscussions";
import UserComments from "../../src/components/UsersComments";

const Feeds = ({ data }) => {
    return (
        <Row gutter={[16, 16]}>
            <Col lg={{ span: 10, offset: 7 }} xs={{ span: 24 }}>
                <Card>
                    <UserComments sort={data?.sort} />
                    <BackTop />
                </Card>
            </Col>
            <Col lg={{ span: 7 }} xs={{ span: 24 }}>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <TopDiscussions />
                    </Col>
                    <Col span={24}>
                        <PoolingsCard />
                    </Col>
                </Row>
            </Col>
        </Row>
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
