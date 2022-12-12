import RichTextEditor from "./RichTextEditor";
import RichTextEditorContent from "./RichTextEditorContent";

const CustomRichEditorBiasa = ({ editor }) => {
    return (
        <>
            <RichTextEditor
                style={{
                    minHeight: "100px"
                }}
                editor={editor}
            >
                <RichTextEditorContent />
            </RichTextEditor>
        </>
    );
};

export default CustomRichEditorBiasa;
