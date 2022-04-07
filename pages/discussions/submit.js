import {
    AppleOutlined,
    CiOutlined,
    FileImageOutlined,
    LinkOutlined
} from "@ant-design/icons";
import { Card, Select, Tabs } from "antd";
import { useRouter } from "next/router";
import Layout from "../../src/components/Layout";
import Post from "../../src/components/reddits/Post";

const { TabPane } = Tabs;

const RedditSubmit = ({ data }) => {
    const router = useRouter();
    const handleChange = (e) => {
        router.push({
            query: {
                type: e
            }
        });
    };

    return (
        <Layout title="Buat Diskusi">
            <Select
                placeholder="Cari Komunitas"
                style={{ width: "20%", marginBottom: 10 }}
                showSearch
            ></Select>
            <Card>
                <Tabs activeKey={data?.query} onChange={handleChange}>
                    <TabPane
                        tab={
                            <span>
                                <AppleOutlined />
                                Post
                            </span>
                        }
                        key="post"
                    >
                        <Post />
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <LinkOutlined />
                                Link
                            </span>
                        }
                        key="link"
                    >
                        Tab 2
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <FileImageOutlined />
                                Gambar dan Video
                            </span>
                        }
                        key="imagevideo"
                    >
                        Image dan Video
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <CiOutlined />
                                Pool
                            </span>
                        }
                        key="poll"
                    >
                        Poll
                    </TabPane>
                </Tabs>
            </Card>
        </Layout>
    );
};

export const getServerSideProps = async (ctx) => {
    const type = ctx.query.type || "post";
    return {
        props: {
            data: {
                query: type
            }
        }
    };
};

RedditSubmit.auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["MASTER", "PTTPK"]
};

export default RedditSubmit;
