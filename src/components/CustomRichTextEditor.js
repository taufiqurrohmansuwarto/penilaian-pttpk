import { Button, Space } from "antd";
import RichTextEditor from "./RichTextEditor";
import RichTextEditorContent from "./RichTextEditorContent";

const CustomRichTextEditor = ({
    editor,
    handleSubmit,
    buttonText = "Submit",
    main = false,
    onCancel
}) => {
    return (
        <>
            <RichTextEditor
                style={{
                    minHeight: "100px",
                    marginBottom: 10,
                    width: "100%"
                }}
                editor={editor}
            >
                <RichTextEditorContent />
            </RichTextEditor>
            <Space>
                <Button type="primary" onClick={handleSubmit}>
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
