import { Card, List, Spin } from "antd";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery } from "react-query";
import { getActivities } from "../../services/main.services";
import Layout from "../../src/components/Layout";
import PageContainer from "../../src/components/PageContainer";
import MFeed from "../../src/components/semantic/MFeed";
import MListLoading from "../../src/components/semantic/MListLoading";

function Activities() {
    const { data, isFetchingNextPage, isFetching, fetchNextPage, hasNextPage } =
        useInfiniteQuery(
            ["user-activities"],
            ({ pageParam }) => {
                return getActivities(pageParam);
            },
            {
                getNextPageParam: (pageParams) =>
                    pageParams?.nextCursor ?? undefined
            }
        );
    return (
        <PageContainer
            title="Aktivitas"
            subTitle="Aktivitas User"
            style={{ minHeight: "90vh" }}
        >
            <MListLoading loading={isFetching}>
                {data?.pages?.map((page) => (
                    <React.Fragment key={page?.nextCursor}>
                        <InfiniteScroll
                            next={fetchNextPage}
                            hasMore={hasNextPage}
                            loader={isFetchingNextPage ? <Spin /> : null}
                            dataLength={page?.data?.length}
                        >
                            <Card title="Daftar Aktivitas">
                                <List
                                    dataSource={page?.data}
                                    rowKey={(row) => row?.id}
                                    key={"id"}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <MFeed
                                                sender={item?.sender}
                                                receiver={item?.receiver}
                                                type={item?.type}
                                                comment={item?.comment}
                                                discussion={item?.discussion}
                                                createdAt={item?.created_at}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </InfiniteScroll>
                    </React.Fragment>
                ))}
            </MListLoading>
        </PageContainer>
    );
}

Activities.Auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["PTTPK", "MASTER"]
};

Activities.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default Activities;
