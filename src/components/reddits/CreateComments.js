import moment from "moment";
import { Button, Space, Comment, Form, message, Card } from "antd";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { createCommentByPost, uploads } from "../../../services/main.services";
import RichTextEditor from "../RichTextEditor";
import { CommentOutlined, LikeOutlined } from "@ant-design/icons";

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

    const handleSubmitSubComment = (data) => {
        createCommentsInPost.mutate(data);
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

    const MyComment = ({ comment, user, id }) => {
        const nestedComments = (comment?.children || []).map((comment) => {
            const [nestedMessage, setNestedMessage] = useState("");
            const [nestedId, setNestedId] = useState();

            const handleChangeNestedId = (id) => {
                setNestedId(id);
            };

            const handleCancel = () => {
                setNestedId(null);
            };

            const handleSubmit = () => {
                if (!nestedMessage) {
                    return;
                } else {
                    const data = {
                        id,
                        data: { comment: nestedMessage, parent_id: comment?.id }
                    };
                    handleSubmitSubComment(data);
                }
            };

            return (
                <Comment
                    actions={[
                        <LikeOutlined />,
                        <div
                            style={{ cursor: "pointer" }}
                            onClick={() => handleChangeNestedId(comment?.id)}
                        >
                            <span style={{ marginRight: 4 }}>Balas</span>
                            <CommentOutlined />
                        </div>
                    ]}
                    key={comment.id}
                    avatar={comment?.user?.image}
                    author={comment?.user?.username}
                    datetime={moment(comment?.created_at).fromNow()}
                    content={
                        <>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: comment?.content
                                }}
                            />
                        </>
                    }
                >
                    {nestedId === comment?.id && (
                        <Comment
                            avatar={user?.user?.image}
                            content={
                                <Editor
                                    onSubmit={handleSubmit}
                                    value={nestedMessage}
                                    onChange={setNestedMessage}
                                    onCancel={handleCancel}
                                />
                            }
                        />
                    )}
                </Comment>
            );
        });

        return (
            <Comment
                avatar={comment?.user?.image}
                author={comment?.user?.username}
                datetime={moment(comment?.created_at).fromNow()}
                actions={[
                    <LikeOutlined />,
                    <div style={{ cursor: "pointer" }}>
                        <span style={{ marginRight: 4 }}>Balas</span>
                        <CommentOutlined />
                    </div>
                ]}
                content={
                    <div
                        dangerouslySetInnerHTML={{ __html: comment?.content }}
                    />
                }
            >
                {nestedComments}
            </Comment>
        );
    };

    return (
        <>
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
            <Card>
                {data?.map((d) => (
                    <MyComment
                        handleSubmit={handleSubmitSubComment}
                        user={dataUser}
                        id={id}
                        comment={d}
                        key={d.id}
                    />
                ))}
            </Card>
        </>
    );
}

export default CreateComments;
