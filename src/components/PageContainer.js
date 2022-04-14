import dynamic from "next/dynamic";

export default dynamic(
    () => import("@ant-design/pro-layout").then((d) => d?.PageContainer),
    {
        // Disable during server side rendering
        ssr: false,

        // Render anything as fallback on server, e.g. loader or html content without editor
        loading: () => null
    }
);
