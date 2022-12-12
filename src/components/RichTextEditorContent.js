import dynamic from "next/dynamic";

export default dynamic(
    () => import("@mantine/tiptap").then((r) => r?.RichTextEditor.Content),
    {
        // Disable during server side rendering
        ssr: false,

        // Render anything as fallback on server, e.g. loader or html content without editor
        loading: () => null
    }
);
