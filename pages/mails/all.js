import { Button } from "antd";
import React from "react";
import Layout from "../../src/components/Layout";
import MailLayout from "../../src/components/MailLayout";

function All() {
    return <div>Semua</div>;
}

All.getLayout = function getLayout(page) {
    return (
        <Layout disableContentMargin={true}>
            <MailLayout>{page}</MailLayout>
        </Layout>
    );
};

All.Auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["PTTPK", "MASTER"]
};

export default All;
