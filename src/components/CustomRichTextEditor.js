import { Button, Space } from "antd";
import { useMemo } from "react";
import { findUsers, uploads } from "../../services/main.services";
import RichTextEditor from "./RichTextEditor";

const CustomRichTextEditor = ({
    text,
    setText,
    handleSubmit,
    submitting,
    buttonText = "Submit",
    main,
    onCancel
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

    const modules = useMemo(
        () => ({
            history: { delay: 2500, userOnly: true }
            // syntax: true
        }),
        []
    );

    return (
        <>
            <RichTextEditor
                onImageUpload={handleUpload}
                modules={modules}
                value={text}
                onChange={setText}
                mentions={mentions}
                controls={[["image", "video", "bold", "italic"]]}
                style={{ minHeight: 200, marginTop: 8, marginBottom: 8 }}
            />
            <Space>
                <Button
                    type="primary"
                    loading={submitting}
                    onClick={handleSubmit}
                >
                    {buttonText}
                </Button>
                {!main && <Button onClick={onCancel}>Batal</Button>}
            </Space>
        </>
    );
};

export default CustomRichTextEditor;
