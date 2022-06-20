import { Card } from "antd";
import React from "react";
import MailLayout from "../../../src/components/CustomLayout/MaiLayout";
import Layout from "../../../src/components/Layout";
import Detail from "../../../src/components/MailComponents/Detail";

function DetailInbox() {
    return (
        <Card title="Detail Kotak Masuk">
            <Detail inbox={true} />
        </Card>
    );
}

DetailInbox.getLayout = function getLayout(page) {
    return (
        <Layout disableContentMargin={true}>
            <MailLayout>{page}</MailLayout>
        </Layout>
    );
};

DetailInbox.Auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["PTTPK", "MASTER"]
};

export default DetailInbox;
