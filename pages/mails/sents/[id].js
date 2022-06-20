import { Card } from "antd";
import React from "react";
import MailLayout from "../../../src/components/CustomLayout/MaiLayout";
import Layout from "../../../src/components/Layout";
import Detail from "../../../src/components/MailComponents/Detail";

function DetailMailSents() {
    return (
        <Card title="Detail Pesan Terkirim">
            <Detail inbox={false} />
        </Card>
    );
}

DetailMailSents.getLayout = function getLayout(page) {
    return (
        <Layout disableContentMargin={true}>
            <MailLayout>{page}</MailLayout>
        </Layout>
    );
};

DetailMailSents.Auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["PTTPK", "MASTER"]
};

export default DetailMailSents;
