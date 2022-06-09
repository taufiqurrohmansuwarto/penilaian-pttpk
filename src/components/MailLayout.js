import { MailOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import Link from "next/link";
import React from "react";

const ProLayout = dynamic(
    () => import("@ant-design/pro-layout").then((mod) => mod?.ProLayout),
    {
        ssr: false,

        loading: () => null
    }
);

const menuItemRender = (options, element) => {
    return (
        <Link href={`${options.path}`}>
            <a>{element}</a>
        </Link>
    );
};

function MailLayout({ children }) {
    return (
        <ProLayout
            navTheme="light"
            headerRender={false}
            route={{
                routes: [
                    {
                        path: "/mails/all",
                        name: "All",
                        icon: <MailOutlined />
                    }
                ]
            }}
            style={{ height: "95vh" }}
            collapsedButtonRender={false}
            collapsed={false}
            menuHeaderRender={false}
            menuItemRender={menuItemRender}
        >
            {children}
        </ProLayout>
    );
}

export default MailLayout;
