import { Button, Input } from "antd";
import RichTextEditor from "../RichTextEditor";

const Post = ({
    title,
    onChangeTitle,
    description,
    onChangeDescription,
    handleSubmit,
    loading
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
            <Button
                type="primary"
                disabled={!title || !description}
                loading={loading}
                onClick={handleSubmit}
            >
                Submit
            </Button>
        </>
    );
};

export default Post;
