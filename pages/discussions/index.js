import { Button, Card, Col, Divider, Row, Skeleton } from "antd";
import CheckableTag from "antd/lib/tag/CheckableTag";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useInfiniteQuery } from "react-query";
import { getPosts } from "../../services/main.services";
import Layout from "../../src/components/Layout";
import CardRules from "../../src/components/reddits/Cards/CardRules";
import CreatePostAndCommunities from "../../src/components/reddits/Cards/CreatePostAndCommunities";
import Posts from "../../src/components/reddits/Cards/Posts";

const Discussions = ({ data }) => {
    const filter = ["terbaru", "vote", "populer"];
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

    const handleUpvote = (id) => {};

    const hanldeDownvote = (id) => {};

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

    return (
        <Layout>
            <Row gutter={32}>
                <Col span={7}></Col>
                <Col span={10}>
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
                    <Divider />
                    <Skeleton loading={loadingDataPosts}>
                        {dataPosts?.pages?.map((page) => (
                            <React.Fragment key={page?.nextCursor}>
                                <Posts
                                    data={page?.data}
                                    isFetchingNextPage={isFetchingNextPage}
                                    loading={loadingDataPosts}
                                    hasNextPage={hasNextPage}
                                    fetchNextPage={fetchNextPage}
                                />
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
                <Col span={7}>
                    <Row gutter={[8, 8]}>
                        <Col>
                            <CreatePostAndCommunities />
                        </Col>
                        <Col>
                            <CardRules />
                        </Col>
                    </Row>
                </Col>
            </Row>
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
