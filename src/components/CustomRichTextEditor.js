import { Button } from "@mantine/core";
import { Space } from "antd";
import { useMemo } from "react";
import { findUsers, uploads } from "../../services/main.services";
import RichTextEditor from "./RichTextEditor";

const CustomRichTextEditor = ({
    text,
    setText,
    handleSubmit,
    buttonText = "Submit",
    main = false,
    onCancel,
    placeholder = ""
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

    return (
        <>
            <RichTextEditor
                styles={{
                    root: {
                        padding: 0,
                        margin: 0,
                        minHeight: "10px !important",

                        width: "100%",
                        marginBottom: 14
                    }
                }}
                sx={(theme) => ({
                    "&:hover": {
                        borderColor: theme.colors.indigo
                    }
                })}
                placeholder={placeholder}
                onImageUpload={handleUpload}
                value={text}
                onChange={setText}
                mentions={mentions}
                controls={[
                    ["image", "video", "link", "unorderedList", "orderedList"]
                ]}
                radius={10}
            />
            <Space>
                <Button color="grape" onClick={handleSubmit}>
                    {buttonText}
                </Button>
                {!main && (
                    <Button variant="outline" onClick={onCancel}>
                        Batal
                    </Button>
                )}
            </Space>
        </>
    );
};

export default CustomRichTextEditor;
