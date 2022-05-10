import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    CommentOutlined,
    SaveOutlined
} from "@ant-design/icons";
import { Group, Paper, Spoiler } from "@mantine/core";
import {
    Card,
    Comment,
    Input,
    List,
    message,
    Modal,
    Popconfirm,
    Skeleton,
    Typography
} from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import {
    downvotePost,
    removePostByUser,
    updatePostByUser,
    upvotePost
} from "../../../../services/main.services";
import RichTextEditorNew from "../../RichTextEditorNew";

function Posts({ data, user, canEditRemove, sort }) {
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

        // must be change
        const upvoteMutation = useMutation((data) => upvotePost(data), {
            onError: (e) => console.log(e),
            onSuccess: (result) => {
                queryClient.setQueryData(
                    ["posts", "filter", sort],
                    (previous) => {
                        const kumat = previous?.pages?.map((p) => {
                            const data = p?.data?.map((x) =>
                                x?.id === result?.id ? result : x
                            );
                            const nextCursor = p?.nextCursor;

                            const hasil = { data, nextCursor };

                            return hasil;
                        });

                        return {
                            ...previous,
                            pages: kumat
                        };
                    }
                );

                queryClient.invalidateQueries({
                    queryKey: ["posts", "filter"],
                    refetchActive: false
                });
            }
        });

        const downvoteMutation = useMutation((data) => downvotePost(data), {
            onError: (e) => console.log(e),
            onSuccess: (result) => {
                queryClient.setQueryData(
                    ["posts", "filter", sort],
                    (previous) => {
                        const kumat = previous?.pages?.map((p) => {
                            const data = p?.data?.map((x) =>
                                x?.id === result?.id ? result : x
                            );
                            const nextCursor = p?.nextCursor;

                            const hasil = { data, nextCursor };

                            return hasil;
                        });

                        return {
                            ...previous,
                            pages: kumat
                        };
                    }
                );

                queryClient.invalidateQueries({
                    queryKey: ["posts", "filter"],
                    refetchActive: false
                });
            }
        });

        const removePostMutation = useMutation(
            (data) => removePostByUser(data),
            {
                onSuccess: () => {
                    queryClient.invalidateQueries(["posts"]);
                },
                onError: () => message.error("Gagal")
            }
        );

        const updatePostMutation = useMutation(
            (data) => updatePostByUser(data),
            {
                onSuccess: () => {
                    queryClient.invalidateQueries(["posts"]);
                }
            }
        );

        const handleUpvote = (id) => {
            const data = { id };
            upvoteMutation.mutate(data);
        };

        const handleDownvote = (id) => {
            const data = { id };
            downvoteMutation.mutate(data);
        };

        const [showUpdate, setShowUpdate] = useState(false);
        const [currentData, setCurrentData] = useState(null);

        const [editTitle, setEditTitle] = useState();
        const [editComment, setEditComment] = useState();

        useEffect(() => {}, [currentData, showUpdate]);

        const handleRemove = (id) => {
            removePostMutation.mutate(id);
        };

        const handleUpdate = () => {
            const values = {
                id: currentData?.id,
                data: {
                    title: editTitle,
                    content: editComment
                }
            };
            updatePostMutation.mutate(values);
        };

        const openModal = (data) => {
            setCurrentData(data);
            setEditComment(data?.content);
            setEditTitle(data?.title);
            setShowUpdate(true);
        };

        const onCancel = () => {
            setCurrentData(null);
            setShowUpdate(false);
        };

        return (
            <>
                <Modal
                    title="Edit Diskusi"
                    width={800}
                    centered
                    visible={showUpdate}
                    confirmLoading={updatePostMutation.isLoading}
                    onCancel={onCancel}
                    onOk={handleUpdate}
                >
                    <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e?.target?.value)}
                    />
                    <RichTextEditorNew
                        text={editComment}
                        setText={setEditComment}
                    />
                </Modal>
                <Comment
                    avatar={data?.user?.image}
                    author={data?.user?.username}
                    datetime={
                        <>&#x2022; {moment(data?.created_at).fromNow()}</>
                    }
                    content={
                        <>
                            <Typography.Title level={5}>
                                {data?.title}
                            </Typography.Title>
                            <Spoiler
                                maxHeight={120}
                                showLabel="Show more"
                                hideLabel="Hide"
                                transitionDuration={0}
                            >
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: data?.content
                                    }}
                                />
                            </Spoiler>
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
                        </span>,
                        <span>
                            <SaveOutlined />
                            <span style={{ marginLeft: 4 }}>Simpan</span>
                        </span>,
                        <>
                            {canEditRemove && (
                                <span onClick={() => openModal(data)}>
                                    Edit
                                </span>
                            )}
                        </>,
                        <>
                            {canEditRemove && (
                                <Popconfirm
                                    title="Apakah anda yakin ingin menghapus diskusi yang telah anda buat?"
                                    onConfirm={() => {
                                        handleRemove(data?.id);
                                    }}
                                >
                                    <span>Hapus</span>
                                </Popconfirm>
                            )}
                        </>
                    ]}
                />
            </>
        );
    };

    return (
        <List
            dataSource={data}
            itemLayout="horizontal"
            grid={{ column: 1 }}
            rowKey={(row) => row?.id}
            renderItem={(item) => {
                return (
                    <Paper
                        p="lg"
                        style={{ marginTop: 10 }}
                        radius="xs"
                        shadow="md"
                    >
                        <CustomCard data={item} user={user} />
                    </Paper>
                );
            }}
        />
    );
}

export default Posts;
