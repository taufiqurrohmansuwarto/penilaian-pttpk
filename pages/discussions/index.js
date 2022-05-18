import { FileAddOutlined } from "@ant-design/icons";
import { Alert, Button } from "@mantine/core";
import { BackTop, Card, Col, Row, Spin } from "antd";
import CheckableTag from "antd/lib/tag/CheckableTag";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery } from "react-query";
import { Icon } from "semantic-ui-react";
import { getPosts } from "../../services/main.services";
import Layout from "../../src/components/Layout";
import PageContainer from "../../src/components/PageContainer";
import Posts from "../../src/components/reddits/Cards/Posts";
import MListLoading from "../../src/components/semantic/MListLoading";

const Discussions = ({ data }) => {
    const filter = ["terbaru", "vote", "populer"];
    const { data: userData } = useSession();

    const router = useRouter();

    const [selectedFilter, setSelectedFilter] = useState(data?.sort);

    const {
        data: dataPosts,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        isFetching
    } = useInfiniteQuery(
        ["posts", "filter", selectedFilter],
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

    return (
        <PageContainer
            style={{ minHeight: "100vh" }}
            title="Diskusi"
            subTitle="Untuk forum dan diskusi"
        >
            <Row>
                <Col lg={{ span: 12, offset: 6 }} xs={{ span: 24 }}>
                    <Alert
                        title="Perhatian"
                        color="green"
                        variant="filled"
                        style={{ marginBottom: 8 }}
                        icon={<Icon name="announcement" />}
                    >
                        Gunakan forum diskusi untuk mendiskusikan sesuatu. Kalau
                        suka diupvote (tekan tombol naik)
                    </Alert>
                    <Button
                        onClick={createPost}
                        variant="white"
                        leftIcon={<FileAddOutlined />}
                    >
                        Buat Diskusi
                    </Button>

                    <Card
                        size="small"
                        style={{ marginBottom: 8, marginTop: 8 }}
                    >
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
                    <MListLoading loading={isFetching}>
                        {dataPosts?.pages?.map((page) => (
                            <React.Fragment key={page?.nextCursor}>
                                <InfiniteScroll
                                    next={fetchNextPage}
                                    hasMore={hasNextPage}
                                    loader={
                                        isFetchingNextPage ? <Spin /> : null
                                    }
                                    dataLength={page?.data?.length}
                                >
                                    <Posts
                                        sort={selectedFilter}
                                        canEditRemove={false}
                                        data={page?.data}
                                        user={userData}
                                    />
                                </InfiniteScroll>
                            </React.Fragment>
                        ))}
                    </MListLoading>
                    <BackTop />
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

Discussions.Auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["MASTER", "PTTPK"]
};

Discussions.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default Discussions;
