import moment from "moment";
import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    CommentOutlined
} from "@ant-design/icons";
import { Avatar, Card, Col, Row, Space, Typography } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { useSession } from "next-auth/react";
import { downvotePost, upvotePost } from "../../../../services/main.services";

const UpvoteDownvote = ({ data, votes, id }) => {
    const { data: user } = useSession();
    const queryClient = useQueryClient();

    const upvoteColor = () => {
        const result = data?.discussions_votes?.find(
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

    const downvoteColor = () => {
        const result = data?.discussions_votes?.find(
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
            queryClient.invalidateQueries(["post", id]);
        }
    });

    const downvoteMutation = useMutation((data) => downvotePost(data), {
        onError: (e) => console.log(e),
        onSuccess: () => {
            queryClient.invalidateQueries(["post", id]);
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

function CardPost({ data }) {
    return (
        <Card
            style={{ marginBottom: 8 }}
            size="small"
            title={
                <>
                    <Row>
                        <Col span={20}>
                            <div>
                                <Space align="start">
                                    <Avatar
                                        src={data?.user?.image}
                                        size="large"
                                    />
                                    <div>
                                        <Space
                                            align="start"
                                            direction="vertical"
                                            wrap
                                            size="small"
                                        >
                                            <span>test</span>
                                            <span>test</span>
                                        </Space>
                                    </div>
                                </Space>
                            </div>
                        </Col>
                    </Row>
                </>
            }
            actions={[
                <>
                    <Space>
                        <span>{data?._count?.children_comments} komentar</span>
                        <CommentOutlined />
                    </Space>
                </>
            ]}
        >
            <div dangerouslySetInnerHTML={{ __html: data?.content }} />
        </Card>
    );
}

export default CardPost;
