import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    CommentOutlined
} from "@ant-design/icons";
import { Card, Comment, List, Typography } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { downvotePost, upvotePost } from "../../../../services/main.services";

function Posts({ data, loading, isFetchingNextPage, user }) {
    const router = useRouter();

    const CustomCard = ({ data }) => {
        const gotoComments = (id) => {
            router?.push(`/discussions/${id}/comments`);
        };

        const queryClient = useQueryClient();

        const upvoteColor = (currentData, id) => {
            const result = currentData?.discussions_votes?.find(
                (d) =>
                    d?.discussion_post_id === id &&
                    d?.user_custom_id === user?.user?.id
            );
            if (!result) {
                return "gray";
            } else {
                if (result?.vlag === 1) {
                    return "blue";
                }
                if (result?.vlag === 0) {
                    return "gray";
                }
            }
        };

        const downvoteColor = (currentData, id) => {
            const result = currentData?.discussions_votes?.find(
                (d) =>
                    d?.discussion_post_id === id &&
                    d?.user_custom_id === user?.user?.id
            );
            if (!result) {
                return "gray";
            } else {
                if (result?.vlag === -1) {
                    return "blue";
                }
                if (result?.vlag === 0) {
                    return "gray";
                }
            }
        };

        const upvoteMutation = useMutation((data) => upvotePost(data), {
            onError: (e) => console.log(e),
            onSuccess: () => {
                queryClient.invalidateQueries("post-communities");
                queryClient.invalidateQueries("posts");
            }
        });
        const downvoteMutation = useMutation((data) => downvotePost(data), {
            onError: (e) => console.log(e),
            onSuccess: () => {
                queryClient.invalidateQueries("post-communities");
                queryClient.invalidateQueries("posts");
            }
        });

        const handleUpvote = (id) => {
            const data = { id };
            upvoteMutation.mutate(data);
        };

        const handleDownvote = (id) => {
            const data = { id };
            downvoteMutation.mutate(data);
        };

        return (
            <Comment
                avatar={data?.user?.image}
                author={data?.user?.username}
                datetime={moment(data?.created_at).fromNow()}
                content={
                    <>
                        <Typography.Title level={5} style={{ marginTop: 14 }}>
                            {data?.title}
                        </Typography.Title>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: data?.content
                            }}
                        />
                    </>
                }
                actions={[
                    <span onClick={() => handleUpvote(data?.id)}>
                        <ArrowUpOutlined
                            style={{ color: upvoteColor(data, data?.id) }}
                        />
                    </span>,
                    <span>{data?.votes}</span>,
                    <span onClick={() => handleDownvote(data?.id)}>
                        <ArrowDownOutlined
                            style={{ color: downvoteColor(data, data?.id) }}
                        />
                    </span>,
                    <span onClick={() => gotoComments(data?.id)}>
                        <CommentOutlined />
                        <span style={{ marginLeft: 4 }}>
                            {data?._count?.children_comments} Komentar
                        </span>
                    </span>
                ]}
            />
        );
    };

    return (
        <Card>
            <List
                loading={loading || isFetchingNextPage}
                dataSource={data}
                rowKey={(row) => row?.id}
                renderItem={(item) => {
                    return <CustomCard data={item} user={user} />;
                }}
            />
        </Card>
    );
}

export default Posts;
