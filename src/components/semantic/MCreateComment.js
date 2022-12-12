import { Comment } from "antd";
import { useSession } from "next-auth/react";
import CustomRichTextEditor from "../CustomRichTextEditor";

function MCreateComment({
    handleClose,
    editor,
    handleSubmit,
    buttonText = "Balas"
}) {
    const { data } = useSession();

    return (
        <Comment
            avatar={data.user?.image}
            author={data?.user?.name}
            content={
                <CustomRichTextEditor
                    handleSubmit={handleSubmit}
                    onCancel={handleClose}
                    buttonText={buttonText}
                    editor={editor}
                />
            }
        />
    );
}

export default MCreateComment;
