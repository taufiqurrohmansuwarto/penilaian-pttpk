import {
    AppleOutlined,
    CiOutlined,
    FileImageOutlined,
    LinkOutlined
} from "@ant-design/icons";
import { useDebouncedValue } from "@mantine/hooks";
import { Card, Col, Form, Row, Select, Spin, Tabs } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import { findCommunitiesByTitle } from "../../services/main.services";
import Layout from "../../src/components/Layout";
import PageContainer from "../../src/components/PageContainer";
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

    const [search, setSearch] = useState("");
    const [debounceValue] = useDebouncedValue(search, 500);

    const { data: dataCommunities, isLoading: loadingDataCommunities } =
        useQuery(
            ["communities", debounceValue],
            () => findCommunitiesByTitle(debounceValue),
            {
                enabled: !!debounceValue
            }
        );

    const handleSearch = (e) => {
        setSearch(e);
    };

    const handleSelect = (e) => {
        router.push(`/discussions${e}/submit`);
    };

    return (
        <Layout title="Buat Postingan Baru">
            <PageContainer
                title="Buat Diskusi"
                subTitle="Mau diskusi tentang apa?"
            >
                <Row>
                    <Col span={14} offset={4}>
                        <Card>
                            <Form.Item label="Diskusi di komunitas">
                                <Select
                                    value={search}
                                    onChange={(e) => setSearch(e)}
                                    onSearch={handleSearch}
                                    placeholder="Cari Komunitas"
                                    style={{ width: "30%", marginBottom: 10 }}
                                    showSearch
                                    onSelect={handleSelect}
                                    loading={loadingDataCommunities}
                                    notFoundContent={
                                        loadingDataCommunities ? (
                                            <Spin size="small" />
                                        ) : null
                                    }
                                >
                                    {dataCommunities?.map((community) => (
                                        <Select.Option
                                            key={community?.id}
                                            value={community?.link}
                                        >
                                            {community?.link}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Card>
                                <Tabs
                                    activeKey={data?.query}
                                    onChange={handleChange}
                                >
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
                        </Card>
                    </Col>
                </Row>
            </PageContainer>
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
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["MASTER", "PTTPK"]
};

export default RedditSubmit;
