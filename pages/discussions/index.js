import { Button, Card, Col, Divider, Row, Skeleton } from "antd";
import CheckableTag from "antd/lib/tag/CheckableTag";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useInfiniteQuery } from "react-query";
import { getPosts } from "../../services/main.services";
import Layout from "../../src/components/Layout";
import PageContainer from "../../src/components/PageContainer";
import CardRules from "../../src/components/reddits/Cards/CardRules";
import CardTop10 from "../../src/components/reddits/Cards/CardTop10";
import CreatePostAndCommunities from "../../src/components/reddits/Cards/CreatePostAndCommunities";
import ListSubscribes from "../../src/components/reddits/Cards/ListSubscribes";
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
            <PageContainer
                header={{
                    title: "test",
                    breadcrumb: {
                        routes: [
                            { path: "/", breadcrumbName: "test" },
                            { path: "/discussions", breadcrumbName: "tess2" },
                            { path: "/discussions", breadcrumbName: "tess2" }
                        ]
                    }
                }}
            >
                <Row gutter={32}>
                    <Col span={6}>
                        <ListSubscribes />
                    </Col>
                    <Col span={12}>
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
                                        user={userData}
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
                    <Col span={6}>
                        <Row gutter={[8, 8]}>
                            <Col span={24}>
                                <CreatePostAndCommunities />
                            </Col>
                            <Col span={24}>
                                <CardRules />
                            </Col>
                            <Col span={24}>
                                <CardTop10 />
                            </Col>
                        </Row>
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
