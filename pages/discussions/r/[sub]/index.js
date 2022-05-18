import { Card, Col, Divider, Row, Skeleton, Button } from "antd";
import CheckableTag from "antd/lib/tag/CheckableTag";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import {
    findCommunities,
    getPostsByCommunities
} from "../../../../services/main.services";
import Layout from "../../../../src/components/Layout";
import PageContainer from "../../../../src/components/PageContainer";
import CardSubscribePosts from "../../../../src/components/reddits/Cards/CardSubscribePosts";
import ListSubscribes from "../../../../src/components/reddits/Cards/ListSubscribes";
import Posts from "../../../../src/components/reddits/Cards/Posts";
import CreatePost from "../../../../src/components/reddits/CreatePost";

const SubCategories = ({ data }) => {
    const filter = ["terbaru", "vote", "terpopuler"];
    const [selectedFilter, setSelectedFilter] = useState(data?.sort);
    const router = useRouter();
    const { query } = router;

    const { data: userData } = useSession();

    const handleChangeFilter = (checked, tag) => {
        if (checked) {
            setSelectedFilter(tag);
            router.push({
                pathname: "/discussions/r/[sub]",
                query: {
                    sort: tag,
                    sub: query?.sub
                }
            });
        }
    };

    const {
        data: dataPostCommunities,
        isLoading,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage
    } = useInfiniteQuery(
        ["post-communities", query?.sub, selectedFilter],
        ({ pageParam }) =>
            getPostsByCommunities(query?.sub, selectedFilter, pageParam),
        {
            getNextPageParam: (pageParam) => pageParam?.nextCursor ?? undefined,
            enabled: !!query?.sub && !!selectedFilter
        }
    );

    const { data: dataCommunities, isLoading: isLoadingDataCommunities } =
        useQuery(
            ["communities", router?.query?.sub],
            () => findCommunities(router?.query?.sub),
            {
                enabled: !!router?.query?.sub
            }
        );

    useEffect(() => {
        if (!router?.isReady) null;
    }, [router?.query]);

    return (
        <Layout title={`Komunitas ${query?.sub}`}>
            <PageContainer title="Daftar Postingan Komunitas" fixedHeader>
                <Row gutter={[10, 10]}>
                    <Col span={7}>
                        <ListSubscribes />
                    </Col>
                    <Col span={10}>
                        <Card style={{ marginBottom: 8 }}>
                            <CreatePost
                                route={`/discussions/r/${query?.sub}/submit`}
                            />
                        </Card>
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
                        <Skeleton loading={isLoading || isFetchingNextPage}>
                            {dataPostCommunities?.pages?.map((page) => (
                                <React.Fragment key={page?.nextCursor}>
                                    <Posts
                                        data={page?.data}
                                        isFetchingNextPage={isFetchingNextPage}
                                        hasNextPage={hasNextPage}
                                        fetchNextPage={fetchNextPage}
                                        loading={isLoading}
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
                    <Col span={7}>
                        <Skeleton loading={isLoadingDataCommunities}>
                            <CardSubscribePosts
                                id={dataCommunities?.id}
                                title={router?.query?.sub}
                            />
                        </Skeleton>
                    </Col>
                </Row>
            </PageContainer>
        </Layout>
    );
};

SubCategories.auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["PTTPK", "MASTER"]
};

export const getServerSideProps = async (ctx) => {
    const sort = ctx?.query?.sort || "terbaru";
    return {
        props: {
            data: { sort }
        }
    };
};

export default SubCategories;
