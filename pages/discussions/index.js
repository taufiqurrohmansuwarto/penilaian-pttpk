import { FileAddOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Skeleton, Space } from "antd";
import CheckableTag from "antd/lib/tag/CheckableTag";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useInfiniteQuery } from "react-query";
import { getPosts } from "../../services/main.services";
import Layout from "../../src/components/Layout";
import PageContainer from "../../src/components/PageContainer";
import Posts from "../../src/components/reddits/Cards/Posts";

const Discussions = ({ data }) => {
    const filter = ["terbaru", "vote", "populer"];
    const { data: userData } = useSession();

    const router = useRouter();

    const [selectedFilter, setSelectedFilter] = useState(data?.sort);

    const {
        data: dataPosts,
        isLoading: loadingDataPosts,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage
    } = useInfiniteQuery(
        ["posts", selectedFilter],
        ({ pageParam }) => {
            return getPosts(selectedFilter, pageParam);
        },
        {
            getNextPageParam: (pageParam) => pageParam?.nextCursor ?? undefined,
            enabled: !!selectedFilter
        }
    );

    const handleChangeFilter = (checked, tag) => {
        if (checked) {
            setSelectedFilter(tag);
            router.push({
                query: {
                    sort: tag
                }
            });
        }
    };

    const createPost = () => {
        router.push("/discussions/submit");
    };
    const createCommunities = () => {
        router.push("/discussions/komunitas/create");
    };

    return (
        <Layout>
            <PageContainer
                title="Diskusi"
                subTitle="Untuk forum dan diskusi"
                fixedHeader
            >
                <Space style={{ marginBottom: 8 }}>
                    <Button
                        onClick={createPost}
                        type="primary"
                        icon={<FileAddOutlined />}
                    >
                        Diskusi
                    </Button>
                </Space>

                <Row>
                    <Col span={17}>
                        <Card>
                            <span style={{ marginRight: 8 }}>
                                Urutkan berdasarkan :{" "}
                            </span>
                            {filter?.map((f) => (
                                <CheckableTag
                                    key={f}
                                    checked={selectedFilter === f}
                                    onChange={(checked) =>
                                        handleChangeFilter(checked, f)
                                    }
                                >
                                    {f}
                                </CheckableTag>
                            ))}
                        </Card>
                        <Skeleton loading={loadingDataPosts}>
                            {dataPosts?.pages?.map((page) => (
                                <React.Fragment key={page?.nextCursor}>
                                    <Card>
                                        <Posts
                                            data={page?.data}
                                            isFetchingNextPage={
                                                isFetchingNextPage
                                            }
                                            loading={loadingDataPosts}
                                            hasNextPage={hasNextPage}
                                            fetchNextPage={fetchNextPage}
                                            user={userData}
                                        />
                                    </Card>
                                </React.Fragment>
                            ))}
                            {hasNextPage && (
                                <Button
                                    style={{
                                        width: "100%",
                                        marginTop: 10,
                                        marginBottom: 10
                                    }}
                                    block
                                    onClick={() => fetchNextPage()}
                                >
                                    Selanjutnya
                                </Button>
                            )}
                        </Skeleton>
                    </Col>
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

Discussions.auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["MASTER", "PTTPK"]
};

export default Discussions;
