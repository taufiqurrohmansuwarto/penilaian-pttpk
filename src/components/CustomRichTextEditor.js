import { Avatar, Button, Divider, Space } from "antd";
import { transform } from "lodash";
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

    const modules = useMemo(
        () => ({
            history: { delay: 2500, userOnly: true }
            // syntax: true
        }),
        []
    );

    return (
        <>
            <div>
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
                        // backgroundColor: theme.colors.gray[0],
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
                        [
                            "image",
                            "video",
                            "link",
                            "unorderedList",
                            "orderedList"
                        ]
                    ]}
                    radius={10}
                />
            </div>
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
