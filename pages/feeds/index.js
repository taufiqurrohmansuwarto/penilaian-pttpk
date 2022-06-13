import { MessageOutlined } from "@ant-design/icons";
import { BackTop, Button, Card, Col, Row } from "antd";
import { useRouter } from "next/router";
import Layout from "../../src/components/Layout";
import PageContainer from "../../src/components/PageContainer";
import PoolingsCard from "../../src/components/Pools/PoolingsCard";
import TopDiscussions from "../../src/components/reddits/Cards/TopDiscussions";
import UserComments from "../../src/components/UsersComments";

const Feeds = ({ data }) => {
    const router = useRouter();
    const gotoChatOnline = () => router.push("/online-chat");

    return (
        <>
            <Button
                size="small"
                type="primary"
                shape="round"
                style={{
                    zIndex: 99,
                    position: "fixed",
                    bottom: 40,
                    right: 10
                }}
                onClick={gotoChatOnline}
                icon={<MessageOutlined />}
            >
                Chat
            </Button>

            <PageContainer title="Beranda" subTitle="Berbagi">
                <Row gutter={[16, 16]}>
                    <Col lg={{ span: 12, offset: 6 }} xs={{ span: 24 }}>
                        <Card>
                            <UserComments sort={data?.sort} />
                            <BackTop />
                        </Card>
                    </Col>
                    <Col lg={{ span: 6 }} xs={{ span: 24 }}>
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
            </PageContainer>
        </>
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
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["PTTPK", "MASTER"]
};

Feeds.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default Feeds;
