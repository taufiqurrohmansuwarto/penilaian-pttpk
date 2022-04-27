import { useRouter } from "next/router";
import { useState } from "react";
import { useInfiniteQuery } from "react-query";
import { getPosts } from "../../../services/main.services";
import AccountDiscussionsLayout from "../../../src/components/AccountDiscussionsLayout";
import Layout from "../../../src/components/Layout";

function Posts({ data }) {
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
        <Layout>
            <AccountDiscussionsLayout activeKey="diskusi">
                <div>{JSON.stringify(dataPosts)}</div>
            </AccountDiscussionsLayout>
        </Layout>
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

Posts.Auth = {
    groups: ["MASTER", "PTTPK"],
    roles: ["USER", "PTTPK"]
};

export default Posts;
