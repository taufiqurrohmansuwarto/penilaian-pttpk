import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    SendOutlined
} from "@ant-design/icons";
import { Button, Card, Comment, Form, message, Space, Tag } from "antd";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import {
    createCommentByPost,
    downvotePost,
    uploads,
    upvotePost
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

    const upvoteMutation = useMutation((data) => upvotePost(data));
    const downvoteMutation = useMutation((data) => downvotePost(data));

    const handleUpvote = () => {};
    const handleDownvote = () => {};

    return (
        <Comment
            avatar={comment?.user?.image}
            author={
                <div>
                    <Space>
                        <span>{comment?.user?.username}</span>
                        {comment?.user_custom_id ===
                            comment?.parent_comments?.user_custom_id && (
                            <Tag color="green">Pembuat Postingan</Tag>
                        )}
                    </Space>
                </div>
            }
            datetime={moment(comment?.created_at).fromNow()}
            actions={[
                <div style={{ cursor: "pointer", marginRight: 14 }}>
                    <Space>
                        <ArrowUpOutlined />
                        <span>{comment?.votes}</span>
                        <ArrowDownOutlined />
                    </Space>
                </div>,
                <div
                    style={{ cursor: "pointer" }}
                    onClick={() => handleShowEditor(comment?.id)}
                >
                    <Space>
                        <span>BALAS</span>
                    </Space>
                </div>
            ]}
            content={
                <div dangerouslySetInnerHTML={{ __html: comment?.content }} />
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
                                    <Tag color="green">Pembuat Postingan</Tag>
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
    buttonText = "Tambah Komentar"
}) => (
    <div>
        <Form.Item>
            <RichTextEditor
                onImageUpload={handleUpload}
                style={{ minHeight: 250 }}
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
            },
            onError: (e) => message.error("Error")
        }
    );

    const handleSubmit = () => {
        if (!comment) {
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

    return (
        <Card>
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
            {data?.map((d) => (
                <MyComment user={dataUser} id={id} comment={d} key={d.id} />
            ))}
        </Card>
    );
}

export default CreateComments;
