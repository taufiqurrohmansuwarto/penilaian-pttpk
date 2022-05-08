import { Button, Typography } from "antd";
import React from "react";
import MailLayout from "../../src/components/CustomLayout/MaiLayout";
import Layout from "../../src/components/Layout";

function Create() {
    return <Button type="primary">Hello</Button>;
}

Create.getLayout = function getLayout(page) {
    return (
        <Layout disableContentMargin={true}>
            <MailLayout>{page}</MailLayout>
        </Layout>
    );
};

Create.Auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["PTTPK", "MASTER"]
};

export default Create;
