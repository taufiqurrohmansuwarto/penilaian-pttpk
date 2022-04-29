import {
    BackwardOutlined,
    SendOutlined,
    UndoOutlined
} from "@ant-design/icons";
import {
    Button,
    Card,
    Comment,
    Form,
    message,
    Popconfirm,
    Space,
    Tag,
    Typography
} from "antd";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import {
    createCommentByPost,
    deletePost,
    updatePost,
    uploads
} from "../../../services/main.services";
import RichTextEditor from "../RichTextEditor";

const MyComment = ({ comment, user, id }) => {
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

    const nestedComments = (comment?.children || []).map((comment) => {
        return (
            <MyComment
                comment={comment}
                id={id}
                key={comment?.id}
                user={user}
            />
        );
    });

    const [nestedComment, setNestedComment] = useState();
    const [nestedId, setNestedId] = useState();

    const [editComment, setEditComment] = useState();
    const [editId, setEditId] = useState();

    const handleSetId = (comment) => {
        setEditId(comment?.id);
        setEditComment(comment?.content);
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setEditComment();
    };

    const queryClient = useQueryClient();
    const createCommentNestedComment = useMutation(
        (data) => createCommentByPost(data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["comments", id]);
                setNestedComment("");
                setNestedId(null);
            },
            onError: (e) => message.error("Error")
        }
    );

    const handleShowEditor = (id) => {
        setNestedId(id);
        setNestedComment("");
    };

    const handleCancel = () => setNestedId(null);
    const handleSubmitNested = async (currentId) => {
        if (!nestedComment) {
            return;
        } else {
            const data = { comment: nestedComment, parent_id: currentId };
            const values = { id, data };
            createCommentNestedComment.mutate(values);
        }
    };

    const removeMutation = useMutation((data) => deletePost(data), {
        onSuccess: () => {
            queryClient.invalidateQueries(["comments", id]);
        }
    });

    const updateMutation = useMutation((data) => updatePost(data), {
        onSuccess: () => {
            queryClient.invalidateQueries(["comments", id]);
            setEditId(null);
        }
    });

    const handleRemove = (id) => {
        removeMutation.mutate(id);
    };

    const handleUpdate = () => {
        const currentData = {
            id: editId,
            data: {
                content: editComment
            }
        };
        updateMutation.mutate(currentData);
    };

    return (
        <Comment
            avatar={comment?.user?.image}
            author={
                <div>
                    <Space>
                        <span>{comment?.user?.username}</span>
                        {comment?.user_custom_id ===
                            comment?.parent_comments?.user_custom_id && (
                            <Tag color="green">Kreator</Tag>
                        )}
                    </Space>
                </div>
            }
            datetime={
                <>
                    <Space>
                        <div>{moment(comment?.created_at).fromNow()}</div>
                        <div>{comment?.is_edited && <span>diedit</span>}</div>
                    </Space>
                </>
            }
            actions={[
                <span
                    style={{ cursor: "pointer" }}
                    onClick={() => handleShowEditor(comment?.id)}
                >
                    <span>Balas</span>
                </span>,
                <>
                    {comment?.user_custom_id === user?.user?.id && (
                        <span onClick={() => handleSetId(comment)}>Edit</span>
                    )}
                </>,
                <>
                    {comment?.user_custom_id === user?.user?.id && (
                        <Popconfirm
                            title="Apakah anda yakin ingin menghapus pesan?"
                            onConfirm={() => handleRemove(comment?.id)}
                        >
                            <span>Hapus</span>
                        </Popconfirm>
                    )}
                </>
            ]}
            content={
                <>
                    {editId === comment?.id ? (
                        <Editor
                            onCancel={handleCancelEdit}
                            handleUpload={handleUpload}
                            value={editComment}
                            onChange={setEditComment}
                            buttonText="Edit"
                            onSubmit={handleUpdate}
                        />
                    ) : (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: comment?.content
                            }}
                        />
                    )}
                </>
            }
        >
            {nestedId === comment?.id && (
                <Comment
                    avatar={user?.user?.image}
                    author={
                        <div>
                            <Space>
                                <span>{user?.user?.name}</span>
                                {comment?.user_custom_id ===
                                    comment?.parent_comments
                                        ?.user_custom_id && (
                                    <Tag color="green">Kreator</Tag>
                                )}
                            </Space>
                        </div>
                    }
                >
                    <Editor
                        onCancel={handleCancel}
                        handleUpload={handleUpload}
                        value={nestedComment}
                        onChange={setNestedComment}
                        onSubmit={() => handleSubmitNested(comment?.id)}
                    />
                </Comment>
            )}
            <>{nestedComments}</>
        </Comment>
    );
};

const Editor = ({
    main,
    onChange,
    onSubmit,
    submitting,
    value,
    onCancel,
    handleUpload,
    buttonText = "Komentar"
}) => (
    <div>
        <Form.Item>
            <RichTextEditor
                onImageUpload={handleUpload}
                style={{ minHeight: 180 }}
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
                    icon={<SendOutlined />}
                >
                    {buttonText}
                </Button>
                {!main && <Button onClick={onCancel}>Batal</Button>}
            </Space>
        </Form.Item>
    </div>
);

function CreateComments({ data, id }) {
    const { data: dataUser } = useSession();
    const [comment, setComment] = useState();

    const queryClient = useQueryClient();
    const createCommentsInPost = useMutation(
        (data) => createCommentByPost(data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["comments", id]);
                queryClient.invalidateQueries(["post", id]);
                setComment("");
                message.success("Sukses berkomentar");
            },
            onError: (e) => message.error("Error")
        }
    );

    const handleSubmit = () => {
        const hasil = comment.replace(/<(.|\n)*?>/g, "").trim();

        if (hasil?.length === 0) {
            return;
        } else {
            const data = { comment, parent_id: id };
            const values = { id, data };
            createCommentsInPost.mutate(values);
        }
    };

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

    const router = useRouter();

    return (
        <Card>
            {!router?.query?.target ? (
                <Comment
                    avatar={dataUser?.user?.image}
                    content={
                        <Editor
                            main={true}
                            value={comment}
                            onChange={setComment}
                            submitting={createCommentsInPost?.isLoading}
                            onSubmit={handleSubmit}
                            handleUpload={handleUpload}
                        />
                    }
                />
            ) : (
                <Typography.Link
                    onClick={() =>
                        router?.push(
                            `/discussions/${router?.query?.id}/comments`
                        )
                    }
                >
                    Tampilkan semua komentar
                </Typography.Link>
            )}
            {data?.result?.map((d) => (
                <MyComment user={dataUser} id={id} comment={d} key={d.id} />
            ))}
        </Card>
    );
}

export default CreateComments;
