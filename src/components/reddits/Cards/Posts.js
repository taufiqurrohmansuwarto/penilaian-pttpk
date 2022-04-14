import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    BellOutlined,
    CommentOutlined
} from "@ant-design/icons";
import { Avatar, Card, List, Space, Typography } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import ReactShowMoreText from "react-show-more-text";
import { downvotePost, upvotePost } from "../../../../services/main.services";

const UpvoteDownvote = ({ id, votes, data, user }) => {
    const queryClient = useQueryClient();

    const upvoteColor = () => {
        const result = data?.discussions_votes?.find(
            (d) => d?.discussion_post_id === id && d?.user_custom_id
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

    const downvoteColor = () => {
        const result = data?.discussions_votes?.find(
            (d) => d?.discussion_post_id === id && d?.user_custom_id
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
            queryClient.invalidateQueries("posts");
        }
    });
    const downvoteMutation = useMutation((data) => downvotePost(data), {
        onError: (e) => console.log(e),
        onSuccess: () => {
            queryClient.invalidateQueries("posts");
        }
    });

    const handleUpvote = () => {
        const data = { id };
        upvoteMutation.mutate(data);
    };

    const handleDownvote = () => {
        const data = { id };
        downvoteMutation.mutate(data);
    };

    return (
        <Space align="center" direction="vertical">
            <ArrowUpOutlined
                onClick={handleUpvote}
                style={{ cursor: "pointer", color: upvoteColor() }}
            />
            {votes}
            <ArrowDownOutlined
                onClick={handleDownvote}
                style={{ cursor: "pointer", color: downvoteColor() }}
            />
        </Space>
    );
};

function Posts({ data, loading, isFetchingNextPage, user }) {
    const router = useRouter();

    const Title = ({ title }) => {
        return (
            <>
                <Typography.Paragraph>{title}</Typography.Paragraph>
            </>
        );
    };

    const CustomCard = ({ data }) => {
        const gotoLink = () => {
            router?.push(`/discussions${data?.parent?.link}`);
        };

        const gotoComments = (id) => {
            router?.push(`/discussions/${id}/comments`);
        };

        return (
            <Card
                size="small"
                extra={[
                    <>
                        <Typography.Link onClick={gotoLink}>
                            #{data?.parent?.title}
                        </Typography.Link>
                    </>
                ]}
                title={
                    <div style={{ fontWeight: "normal", fontSize: 14 }}>
                        <Space align="start">
                            <Avatar size="default" src={data?.user?.image} />
                            <Typography.Text>
                                {data?.user?.username}
                            </Typography.Text>
                            <Typography.Text type="secondary">
                                {moment(data?.created_at).fromNow()}
                            </Typography.Text>
                        </Space>
                    </div>
                }
                actions={[
                    <>
                        <Space onClick={() => gotoComments(data?.id)}>
                            <span>
                                {data?._count?.children_comments} komentar
                            </span>
                            <CommentOutlined />
                        </Space>
                    </>,
                    <>
                        <Space>
                            <span>Beritahu</span>
                            <BellOutlined />
                        </Space>
                    </>
                ]}
            >
                <Card.Meta
                    avatar={
                        <>
                            <Space align="start">
                                <div style={{ marginRight: 8 }}>
                                    <UpvoteDownvote
                                        id={data?.id}
                                        votes={data?.votes}
                                        data={data}
                                        user={user}
                                        totalVotes={
                                            data?.votes - data?.downvotes
                                        }
                                    />
                                </div>
                            </Space>
                        </>
                    }
                    title={<Title title={data?.title} />}
                    description={
                        <ReactShowMoreText lines={14}>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: data?.content
                                }}
                            />
                        </ReactShowMoreText>
                    }
                />
            </Card>
        );
    };

    return (
        <div style={{ marginTop: 10 }}>
            <List
                grid={{
                    column: 1,
                    gutter: [10, 10]
                }}
                loading={loading || isFetchingNextPage}
                dataSource={data}
                rowKey={(row) => row?.id}
                renderItem={(item) => {
                    return <CustomCard data={item} user={user} />;
                }}
            />
        </div>
    );
}

export default Posts;
