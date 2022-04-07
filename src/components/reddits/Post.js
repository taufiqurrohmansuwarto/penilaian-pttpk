import { Button, Input, message, Space } from "antd";
import { useState } from "react";
import { useMutation } from "react-query";
import RichTextEditor from "../RichTextEditor";
const Post = () => {
    const [title, setTitle] = useState();
    const [description, onChange] = useState();

    const createPostMutation = useMutation(() => {});

    const handleSubmit = () => {
        if (!title || !description) {
            message.error("Harus diisi");
        } else {
            const data = { title, description };
            console.log(data);
        }
    };

    return (
        <>
            <Input.TextArea
                placeholder="Judul"
                value={title}
                onChange={(e) => setTitle(e?.target.value)}
            />
            <RichTextEditor
                value={description}
                onChange={onChange}
                placeholder="Deskripsi"
                style={{ minHeight: 240, marginTop: 8, marginBottom: 8 }}
            />
            <Button type="primary" onClick={handleSubmit}>
                Submit
            </Button>
        </>
    );
};

export default Post;
