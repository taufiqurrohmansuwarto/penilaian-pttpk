import { Comment } from "antd";
import { useSession } from "next-auth/react";
import CustomRichTextEditor from "../CustomRichTextEditor";

function MCreateComment({
    handleClose,
    text,
    setText,
    handleSubmit,
    buttonText = "Balas"
}) {
    const { data } = useSession();
    return (
        <div>
            <Comment
                avatar={data.user?.image}
                author={data?.user?.name}
                content={
                    <CustomRichTextEditor
                        handleSubmit={handleSubmit}
                        onCancel={handleClose}
                        buttonText={buttonText}
                        text={text}
                        setText={setText}
                    />
                }
            />
        </div>
    );
}

export default MCreateComment;
