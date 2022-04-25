import { Button, Input } from "antd";
import { uploads } from "../../../services/main.services";
import RichTextEditor from "../RichTextEditor";

const Post = ({
    title,
    onChangeTitle,
    description,
    onChangeDescription,
    handleSubmit,
    loading
}) => {
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
            <Input.TextArea
                placeholder="Judul"
                value={title}
                onChange={onChangeTitle}
            />
            <RichTextEditor
                onImageUpload={handleUpload}
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
