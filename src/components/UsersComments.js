import {
    DislikeFilled,
    DislikeOutlined,
    LikeFilled,
    LikeOutlined
} from "@ant-design/icons";
import {
    Avatar,
    Badge,
    Button,
    Card,
    Comment,
    Form,
    Input,
    List,
    message,
    Popconfirm,
    Skeleton,
    Space
} from "antd";
import CheckableTag from "antd/lib/tag/CheckableTag";
import moment from "moment";
import "moment/locale/id";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import {
    createComments,
    dislikes,
    getComments,
    likes,
    removeComment,
    updateComment,
    uploads
} from "../../services/main.services";
import RichTextEditor from "./RichTextEditor";

moment.locale("id");

const { TextArea } = Input;

const filterValue = (commentId, userId, items) => {
    return items?.find(
        (item) =>
            item?.comment_id === commentId && item?.user_custom_id === userId
    )?.value;
};

const hasLike = (commentId, userId, items) => {
    const likeValue = items?.find(
        (item) =>
            item?.comment_id === commentId && item?.user_custom_id === userId
    )?.value;

    return likeValue === 1 ? true : false;
};

const hasDislike = (commentId, userId, items) => {
    const dislikeValue = items?.find(
        (item) =>
            item?.comment_id === commentId && item?.user_custom_id === userId
    )?.value;

    return dislikeValue === -1 ? true : false;
};

const Editor = ({
    main,
    onChange,
    onSubmit,
    submitting,
    value,
    onCancel,
    handleUpload,
    buttonText = "Kirim",
    placeholder = "Apa yang ingin anda sampaikan?"
}) => {
    const upload = async (file) => {
        try {
            const formData = new FormData();
            formData.append("image", file);
            const result = await uploads(formData);
            return result;
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <Form.Item>
                <RichTextEditor
                    onImageUpload={upload}
                    style={{ minHeight: 180 }}
                    labels={placeholder}
                    radius="md"
                    onChange={onChange}
                    controls={[
                        [
                            "bold",
                            "italic",
                            "underline",
                            "link",
                            "orderedList",
                            "unorderedList"
                        ],
                        ["alignCenter", "alignLeft", "alignRight"]
                    ]}
                    value={value}
                />
            </Form.Item>
            <Form.Item>
                <Space>
                    <Button
                        htmlType="submit"
                        loading={submitting}
                        onClick={onSubmit}
                        type="primary"
                    >
                        {buttonText}
                    </Button>
                    {!main && <Button onClick={onCancel}>Batal</Button>}
                </Space>
            </Form.Item>
        </div>
    );
};
const ChildrenComment = ({ data, handleRemove, handleUpdate, user }) => {
    const [editId, setEditId] = useState();
    const [comment, setComment] = useState();

    const onCancel = () => {
        setEditId(null);
    };

    return (
        <div>
            {data?.length > 0 ? (
                <List
                    itemLayout="horizontal"
                    header={`${data?.length} balasan`}
                    dataSource={data}
                    rowKey={(row) => row?.id}
                    renderItem={(item) => {
                        return (
                            <li>
                                <Comment
                                    avatar={
                                        <Avatar
                                            shape="square"
                                            src={item?.user?.image}
                                        />
                                    }
                                    actions={[
                                        <>
                                            {user?.user?.id ===
                                                item?.user_custom_id && (
                                                <span
                                                    onClick={() => {
                                                        setEditId(item?.id);
                                                        setComment(
                                                            item?.comment
                                                        );
                                                    }}
                                                >
                                                    Edit
                                                </span>
                                            )}
                                        </>,

                                        <>
                                            {user?.user?.id ===
                                                item?.user_custom_id && (
                                                <Popconfirm
                                                    title="Apakah anda yakin ingin menghapus"
                                                    onConfirm={() =>
                                                        handleRemove(item?.id)
                                                    }
                                                >
                                                    <span>Hapus</span>
                                                </Popconfirm>
                                            )}
                                        </>
                                    ]}
                                    author={item?.user?.username}
                                    content={
                                        <>
                                            {item?.id === editId ? (
                                                <Editor
                                                    onCancel={onCancel}
                                                    value={comment}
                                                    onChange={setComment}
                                                    onSubmit={async () => {
                                                        await handleUpdate({
                                                            id: item?.id,
                                                            comment: comment
                                                        });
                                                        setEditId(null);
                                                    }}
                                                    buttonText="Edit"
                                                />
                                            ) : (
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: item?.comment
                                                    }}
                                                />
                                            )}
                                        </>
                                    }
                                    datetime={moment(
                                        item?.created_at
                                    ).fromNow()}
                                />
                            </li>
                        );
                    }}
                />
            ) : null}
        </div>
    );
};

const ListComments = ({
    data,
    isLoading,
    user,
    mutation,
    show = true,
    handleLike,
    handleDislike,
    handleRemove,
    handleUpdate
}) => {
    const [id, setId] = useState(null);
    const [editId, setEditId] = useState(null);

    const handleShowEditor = (currentId) => {
        setId(currentId);
        setComment("");
    };

    const [comment, setComment] = useState("");
    const [editComment, setEditComment] = useState("");

    const handleSubmit = async (id) => {
        const data = { parent_id: id, comment };
        if (!comment) {
            return;
        } else {
            await mutation.mutateAsync(data);
            setComment("");
            setId(null);
            setVisibleChildrenComment(id);
        }
    };

    const handleCancel = () => setId(null);
    const handleCancelEdit = () => setEditId(null);

    const [visibleChildrenComment, setVisibleChildrenComment] = useState(null);

    const toggleChildrenComment = (id) => {
        if (visibleChildrenComment === id) {
            setVisibleChildrenComment(null);
        } else {
            setVisibleChildrenComment(id);
        }
    };

    return (
        <div>
            {data?.length ? (
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    rowKey={(row) => row?.id}
                    loading={isLoading}
                    renderItem={(item) => (
                        <li>
                            <Comment
                                actions={[
                                    <span
                                        onClick={() => {
                                            const value = filterValue(
                                                item?.id,
                                                user?.user?.id,
                                                item?.comments_likes
                                            );
                                            handleLike({
                                                commentId: item?.id,
                                                value
                                            });
                                        }}
                                    >
                                        {hasLike(
                                            item?.id,
                                            user?.user?.id,
                                            item?.comments_likes
                                        ) ? (
                                            <>
                                                <LikeFilled />
                                                <span
                                                    style={{ paddingLeft: 8 }}
                                                >
                                                    {item?.likes}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <LikeOutlined />
                                                <span
                                                    style={{ paddingLeft: 8 }}
                                                >
                                                    {item?.likes}
                                                </span>
                                            </>
                                        )}
                                    </span>,

                                    <span
                                        onClick={() => {
                                            const value = filterValue(
                                                item?.id,
                                                user?.user?.id,
                                                item?.comments_likes
                                            );
                                            handleDislike({
                                                commentId: item?.id,
                                                value
                                            });
                                        }}
                                    >
                                        {hasDislike(
                                            item?.id,
                                            user?.user?.id,
                                            item?.comments_likes
                                        ) ? (
                                            <>
                                                <DislikeFilled />
                                                <span
                                                    style={{ paddingLeft: 8 }}
                                                >
                                                    {item?.dislikes}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <DislikeOutlined />
                                                <span
                                                    style={{ paddingLeft: 8 }}
                                                >
                                                    {item?.dislikes}
                                                </span>
                                            </>
                                        )}
                                    </span>,

                                    <span
                                        onClick={() =>
                                            handleShowEditor(item?.id)
                                        }
                                        style={{ fontWeight: "bold" }}
                                    >
                                        Balas
                                    </span>,
                                    <>
                                        {item?.children?.length ? (
                                            <span
                                                onClick={() =>
                                                    toggleChildrenComment(
                                                        item?.id
                                                    )
                                                }
                                                style={{ color: "blue" }}
                                            >
                                                {visibleChildrenComment ===
                                                item?.id
                                                    ? "Tutup"
                                                    : "Buka"}{" "}
                                                {item?.children?.length} balasan
                                            </span>
                                        ) : null}
                                    </>,
                                    <>
                                        {item?.user_custom_id ===
                                            user?.user?.id && (
                                            <Popconfirm
                                                title="Apakah anda yakin ingin menghapus komentar?"
                                                onConfirm={() =>
                                                    handleRemove(item?.id)
                                                }
                                            >
                                                <span>Hapus</span>
                                            </Popconfirm>
                                        )}
                                    </>,
                                    <>
                                        {item?.user_custom_id ===
                                            user?.user?.id && (
                                            <span
                                                onClick={() => {
                                                    setEditId(item?.id);
                                                    setEditComment(
                                                        item?.comment
                                                    );
                                                }}
                                            >
                                                Edit
                                            </span>
                                        )}
                                    </>
                                ]}
                                content={
                                    <>
                                        {editId === item?.id ? (
                                            <Editor
                                                buttonText="Edit"
                                                value={editComment}
                                                onSubmit={async () => {
                                                    await handleUpdate({
                                                        id: item?.id,
                                                        comment: editComment
                                                    });
                                                    setEditId(null);
                                                }}
                                                onCancel={handleCancelEdit}
                                                onChange={setEditComment}
                                            />
                                        ) : (
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: item?.comment
                                                }}
                                            />
                                        )}
                                    </>
                                }
                                datetime={
                                    <div>
                                        {moment(item?.created_at).fromNow()}
                                        <span style={{ marginLeft: 8 }}>
                                            {item?.is_edited
                                                ? "(diedit)"
                                                : null}
                                        </span>
                                    </div>
                                }
                                author={item?.user?.username}
                                avatar={
                                    <Avatar
                                        shape="square"
                                        src={item?.user?.image}
                                    />
                                }
                            >
                                {id === item?.id && (
                                    <Comment
                                        author={user?.user?.name}
                                        avatar={user?.user?.image}
                                    >
                                        <Editor
                                            buttonText="Balas"
                                            value={comment}
                                            onSubmit={() =>
                                                handleSubmit(item?.id)
                                            }
                                            onCancel={handleCancel}
                                            onChange={setComment}
                                        />
                                    </Comment>
                                )}
                                {visibleChildrenComment === item?.id ? (
                                    <ChildrenComment
                                        show={show}
                                        data={item?.children}
                                        handleRemove={handleRemove}
                                        user={user}
                                        handleUpdate={handleUpdate}
                                    />
                                ) : null}
                            </Comment>
                        </li>
                    )}
                />
            ) : null}
        </div>
    );
};

// todo implement likes, filter
const UserComments = ({ sort }) => {
    const filter = ["like", "terbaru", "popular", "me"];
    const router = useRouter();

    const [selectedFilter, setSelectedFilter] = useState(sort);

    const [comment, setComment] = useState("");

    const { data: userData } = useSession();
    const {
        data: dataComments,
        isLoading: isLoadingComments,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage
    } = useInfiniteQuery(
        ["comments", sort],
        ({ pageParam }) => {
            return getComments({ cursor: pageParam, sort });
        },
        {
            getNextPageParam: (pageParams) =>
                pageParams?.nextCursor ?? undefined,
            enabled: !!sort
        }
    );

    const queryClient = useQueryClient();

    const createCommentMutation = useMutation((data) => createComments(data), {
        onSuccess: () => {
            message.success("Berhasil");
            setComment("");
            queryClient.invalidateQueries("comments");
        },
        onError: (e) => {
            console.log(e);
        }
    });

    useEffect(() => {}, [sort]);

    // for rte
    const handleUpload = async (file) => {
        try {
            const formData = new FormData();
            formData.append("image", file);
            const result = await uploads(formData);
            return result;
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = () => {
        const data = { comment, parent_id: null };

        const hasil = comment.replace(/<(.|\n)*?>/g, "").trim();
        if (hasil.length === 0) {
            return;
        } else {
            createCommentMutation.mutate(data);
        }
    };

    const likeMutation = useMutation((data) => likes(data), {
        onSuccess: () => queryClient.invalidateQueries("comments")
    });
    const dislikeMutation = useMutation((data) => dislikes(data), {
        onSuccess: () => queryClient.invalidateQueries("comments")
    });

    const removeMutation = useMutation((data) => removeComment(data), {
        onSuccess: () => queryClient.invalidateQueries("comments")
    });

    const updateMutation = useMutation((data) => updateComment(data), {
        onSuccess: () => queryClient.invalidateQueries("comments")
    });

    const handleLike = (data) => likeMutation.mutate(data);
    const handleDislike = (data) => dislikeMutation.mutate(data);
    const handleRemove = (data) => removeMutation.mutate(data);
    const handleUpdate = async (data) => {
        updateMutation.mutateAsync(data);
    };

    const handleChangeFilter = (a, b) => {
        if (a) {
            setSelectedFilter(b);
            router.push(
                {
                    query: {
                        sort: b
                    }
                },
                undefined,
                { scroll: false }
            );
        }
    };

    return (
        <>
            <Badge.Ribbon text="Status" color="green">
                <Card>
                    <Card.Meta
                        description={`Apa yang ingin anda sampaikan hari ini, ${userData?.user?.name}?`}
                    />
                    <Comment
                        avatar={userData?.user?.image}
                        content={
                            <>
                                <Editor
                                    main={true}
                                    value={comment}
                                    submitting={createCommentMutation.isLoading}
                                    onChange={setComment}
                                    handleUpload={handleUpload}
                                    onSubmit={handleSubmit}
                                />
                            </>
                        }
                    />
                </Card>
            </Badge.Ribbon>

            <Skeleton loading={isLoadingComments}>
                <>
                    <Card style={{ marginTop: 8, marginBottom: 8 }}>
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
                </>

                {dataComments?.pages?.map((page) => (
                    <React.Fragment key={page?.nextCursor}>
                        <Card>
                            <ListComments
                                user={userData}
                                data={page?.data}
                                mutation={createCommentMutation}
                                handleLike={handleLike}
                                handleDislike={handleDislike}
                                handleRemove={handleRemove}
                                handleUpdate={handleUpdate}
                                isLoading={
                                    isLoadingComments || isFetchingNextPage
                                }
                            />
                        </Card>
                    </React.Fragment>
                ))}
                {hasNextPage && (
                    <div
                        style={{
                            textAlign: "center",
                            marginTop: 4,
                            marginBottom: 4
                        }}
                    >
                        <Button onClick={() => fetchNextPage()}>
                            Selanjutnya
                        </Button>
                    </div>
                )}
            </Skeleton>
        </>
    );
};

export default UserComments;
