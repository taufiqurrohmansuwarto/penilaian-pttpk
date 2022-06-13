import { Button, Card, Skeleton } from "antd";
import CheckableTag from "antd/lib/tag/CheckableTag";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useInfiniteQuery } from "react-query";
import { getPosts } from "../../../services/main.services";
import AccountDiscussionsLayout from "../../../src/components/AccountDiscussionsLayout";
import Layout from "../../../src/components/Layout";
import Posts from "../../../src/components/reddits/Cards/Posts";

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
function PostsUser({ data }) {
    const filter = ["terbaru", "vote", "populer"];

    const router = useRouter();

    const { data: userData } = useSession();

    const [selectedFilter, setSelectedFilter] = useState(data?.sort);

    const handleChangeFilter = (checked, tag) => {
        if (checked) {
            setSelectedFilter(tag);
            router.push({
                pathname: `/account/${router?.query?.id}/diskusi`,
                query: {
                    sort: tag
                }
            });
        }
    };

    const {
        data: dataPosts,
        isLoading: loadingDataPosts,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage
    } = useInfiniteQuery(
        ["posts", selectedFilter, router?.query?.id],
        ({ pageParam }) => {
            return getPosts(selectedFilter, pageParam, router?.query?.id);
        },
        {
            getNextPageParam: (pageParam) => pageParam?.nextCursor ?? undefined,
            enabled: !!selectedFilter
        }
    );

    return (
        <AccountDiscussionsLayout activeKey="diskusi">
            <Card>
                <span style={{ marginRight: 8 }}>Urutkan berdasarkan : </span>
                {filter?.map((f) => (
                    <CheckableTag
                        key={f}
                        checked={selectedFilter === f}
                        onChange={(checked) => handleChangeFilter(checked, f)}
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
                                canEditRemove={true}
                                data={page?.data}
                                isFetchingNextPage={isFetchingNextPage}
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
        </AccountDiscussionsLayout>
    );
}

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

PostsUser.Auth = {
    groups: ["MASTER", "PTTPK", "ADMIN"],
    roles: ["USER", "PTTPK"]
};

PostsUser.getLayout = function getLayout({ page }) {
    return <Layout>{page}</Layout>;
};

export default PostsUser;
