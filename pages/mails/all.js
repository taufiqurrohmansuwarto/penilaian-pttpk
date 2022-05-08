import { Button, Typography } from "antd";
import React from "react";
import MailLayout from "../../src/components/CustomLayout/MaiLayout";
import Layout from "../../src/components/Layout";

function All() {
    return <Button type="primary">Hello</Button>;
}

All.getLayout = function getLayout(page) {
    return (
        <Layout disableContentMargin={true}>
            <MailLayout>{page}</MailLayout>
        </Layout>
    );
};

All.Auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["PTTPK", "MASTER"]
};

export default All;
