import { createGetInitialProps } from "@mantine/next";
import Document, { Head, Html, Main, NextScript } from "next/document";

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
    static getInitialProps = getInitialProps;

    render() {
        return (
            <Html>
                <Head />
                {/* <meta
                    http-equiv="Content-Security-Policy"
                    content="upgrade-insecure-requests"
                ></meta> */}
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
