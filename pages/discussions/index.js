import { FileAddOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Col, Row, Skeleton, Space } from "antd";
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
        <PageContainer title="Diskusi" subTitle="Untuk forum dan diskusi">
            <Row>
                <Col lg={{ span: 18 }} xs={24} style={{ marginBottom: 10 }}>
                    <Alert
                        type="info"
                        showIcon
                        message="Perhatian"
                        description="Minta tolong mungkin bisa dicoba untuk membuat diskusi baru. Mungkin sekedar sharing-sharing permasalahan di kepegawaian atau hal yang lain supaya aplikasi tidak membosankan. Ndak usah takut. Dan jangan lupa share ke temen2 ya kalau ada aplikasi ini. PNS dan PTTPK bisa masuk kok jadi bisa saling berinteraksi"
                    />
                </Col>
            </Row>

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
                <Col lg={18} xs={24}>
                    <Card size="small" style={{ marginBottom: 8 }}>
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
    roles: ["USER", "FASILITATOR"],
    groups: ["MASTER", "PTTPK"]
};

Discussions.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default Discussions;
