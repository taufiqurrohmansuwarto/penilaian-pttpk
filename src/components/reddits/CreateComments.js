import { Button, Space, Comment, Form, message } from "antd";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { createCommentByPost, uploads } from "../../../services/main.services";
import RichTextEditor from "../RichTextEditor";

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
        const data = { comment, parent_id: id };
        const values = { id, data };
        createCommentsInPost.mutate(values);
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
        <>
            {JSON.stringify(data)}
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
        </>
    );
}

export default CreateComments;
