import { useMemo } from "react";
import { findUsers, uploads } from "../../services/main.services";
import RichTextEditor from "./RichTextEditor";

const RichTextEditorNew = ({ text, setText }) => {
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

    const mentions = useMemo(
        () => ({
            allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
            mentionDenotationChars: ["@", "#"],
            source: async (searchTerm, renderList) => {
                const values = await findUsers(searchTerm);
                renderList(values);
            }
        }),
        []
    );

    return (
        <RichTextEditor
            onImageUpload={handleUpload}
            value={text}
            onChange={setText}
            mentions={mentions}
            style={{ minHeight: 240, marginTop: 8, marginBottom: 8 }}
        />
    );
};

export default RichTextEditorNew;
