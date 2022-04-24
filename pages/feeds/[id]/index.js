import moment from "moment";
import {
    Avatar,
    Breadcrumb,
    Button,
    Card,
    Col,
    Comment,
    Form,
    List,
    message,
    Popconfirm,
    Row,
    Skeleton,
    Space
} from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
    createComments,
    detailComment,
    dislikes,
    likes,
    removeComment,
    updateComment,
    uploads
} from "../../../services/main.services";
import Layout from "../../../src/components/Layout";
import PageContainer from "../../../src/components/PageContainer";
import RichTextEditor from "../../../src/components/RichTextEditor";
import Link from "next/link";
import {
    DislikeFilled,
    DislikeOutlined,
    LikeFilled,
    LikeOutlined
} from "@ant-design/icons";

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

const ChildrenComponent = ({ data, handleRemove, handleUpdate, user }) => {
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

function DetailFeed() {
    const router = useRouter();
    const { data, isLoading } = useQuery(
        ["detail-comment", router?.query?.id],
        () => detailComment(router?.query?.id),
        {
            enabled: !!router?.query?.id
        }
    );

    const queryClient = useQueryClient();

    const createCommentMutation = useMutation((data) => createComments(data), {
        onSuccess: () => {
            message.success("Berhasil");
            setComment("");
            queryClient.invalidateQueries("detail-comment");
        },
        onError: (e) => {
            console.log(e);
        }
    });

    const likeMutation = useMutation((data) => likes(data), {
        onSuccess: () => queryClient.invalidateQueries("detail-comment")
    });
    const dislikeMutation = useMutation((data) => dislikes(data), {
        onSuccess: () => queryClient.invalidateQueries("detail-comment")
    });

    const removeMutation = useMutation((data) => removeComment(data), {
        onSuccess: () => queryClient.invalidateQueries("detail-comment")
    });

    const updateMutation = useMutation((data) => updateComment(data), {
        onSuccess: () => queryClient.invalidateQueries("detail-comment")
    });

    const handleLike = (data) => likeMutation.mutate(data);
    const handleDislike = (data) => dislikeMutation.mutate(data);
    const handleRemove = (data) => removeMutation.mutate(data);

    const handleUpdate = async (data) => {
        updateMutation.mutateAsync(data);
    };

    const { data: dataUser, status } = useSession();

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
            createCommentMutation.mutate(data);
            setComment("");
            setId(null);
        }
    };

    const handleCancel = () => setId(null);
    const handleCancelEdit = () => setEditId(null);

    return (
        <Layout>
            <PageContainer
                title="Detail"
                subTitle="Postingan"
                breadcrumbRender={() => (
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link href="/feeds">
                                <a>Feedback</a>
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Detail</Breadcrumb.Item>
                    </Breadcrumb>
                )}
            >
                <Skeleton loading={isLoading || status === "loading"}>
                    <Row>
                        <Col span={12} offset={6}>
                            <Card>
                                <Comment
                                    actions={[
                                        <span
                                            onClick={() => {
                                                const value = filterValue(
                                                    data?.id,
                                                    dataUser?.user?.id,
                                                    data?.comments_likes
                                                );
                                                handleLike({
                                                    commentId: data?.id,
                                                    value
                                                });
                                            }}
                                        >
                                            {hasLike(
                                                data?.id,
                                                dataUser?.user?.id,
                                                data?.comments_likes
                                            ) ? (
                                                <>
                                                    <LikeFilled />
                                                    <span
                                                        style={{
                                                            paddingLeft: 8
                                                        }}
                                                    >
                                                        {data?.likes}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <LikeOutlined />
                                                    <span
                                                        style={{
                                                            paddingLeft: 8
                                                        }}
                                                    >
                                                        {data?.likes}
                                                    </span>
                                                </>
                                            )}
                                        </span>,

                                        <span
                                            onClick={() => {
                                                const value = filterValue(
                                                    data?.id,
                                                    dataUser?.user?.id,
                                                    data?.comments_likes
                                                );
                                                handleDislike({
                                                    commentId: data?.id,
                                                    value
                                                });
                                            }}
                                        >
                                            {hasDislike(
                                                data?.id,
                                                dataUser?.user?.id,
                                                data?.comments_likes
                                            ) ? (
                                                <>
                                                    <DislikeFilled />
                                                    <span
                                                        style={{
                                                            paddingLeft: 8
                                                        }}
                                                    >
                                                        {data?.dislikes}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <DislikeOutlined />
                                                    <span
                                                        style={{
                                                            paddingLeft: 8
                                                        }}
                                                    >
                                                        {data?.dislikes}
                                                    </span>
                                                </>
                                            )}
                                        </span>,

                                        <span
                                            onClick={() =>
                                                handleShowEditor(data?.id)
                                            }
                                            style={{ fontWeight: "bold" }}
                                        >
                                            Balas
                                        </span>,
                                        <>
                                            {data?.user_custom_id ===
                                                dataUser?.user?.id && (
                                                <Popconfirm
                                                    title="Apakah anda yakin ingin menghapus komentar?"
                                                    onConfirm={() =>
                                                        handleRemove(data?.id)
                                                    }
                                                >
                                                    <span>Hapus</span>
                                                </Popconfirm>
                                            )}
                                        </>,
                                        <>
                                            {data?.user_custom_id ===
                                                dataUser?.user?.id && (
                                                <span
                                                    onClick={() => {
                                                        setEditId(data?.id);
                                                        setEditComment(
                                                            data?.comment
                                                        );
                                                    }}
                                                >
                                                    Edit
                                                </span>
                                            )}
                                        </>
                                    ]}
                                    avatar={
                                        <Avatar
                                            src={data?.user?.image}
                                            shape="square"
                                        />
                                    }
                                    author={data?.user?.username}
                                    datetime={moment(
                                        data?.created_at
                                    ).fromNow()}
                                    content={
                                        <>
                                            {editId === data?.id ? (
                                                <Editor
                                                    buttonText="Edit"
                                                    value={editComment}
                                                    onSubmit={async () => {
                                                        await handleUpdate({
                                                            id: data?.id,
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
                                                        __html: data?.comment
                                                    }}
                                                />
                                            )}
                                        </>
                                    }
                                >
                                    {id === data?.id && (
                                        <Comment
                                            author={dataUser?.user?.name}
                                            avatar={dataUser?.user?.image}
                                        >
                                            <Editor
                                                buttonText="Balas"
                                                value={comment}
                                                onSubmit={() =>
                                                    handleSubmit(data?.id)
                                                }
                                                onCancel={handleCancel}
                                                onChange={setComment}
                                            />
                                        </Comment>
                                    )}
                                    <ChildrenComponent
                                        data={data?.children}
                                        user={dataUser}
                                        handleRemove={handleRemove}
                                        handleUpdate={handleUpdate}
                                    />
                                </Comment>
                            </Card>
                        </Col>
                    </Row>
                </Skeleton>
            </PageContainer>
        </Layout>
    );
}

DetailFeed.Auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["MASTER", "PTTPK"]
};

export default DetailFeed;
