import { Button, Input, message } from "antd";
import { useState } from "react";
import RichTextEditor from "../RichTextEditor";

const Post = ({
    title,
    onChangeTitle,
    description,
    onChangeDescription,
    handleSubmit
}) => {
    return (
        <>
            <Input.TextArea
                placeholder="Judul"
                value={title}
                onChange={onChangeTitle}
            />
            <RichTextEditor
                value={description}
                onChange={onChangeDescription}
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
