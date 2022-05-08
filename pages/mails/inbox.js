import React from "react";
import MailLayout from "../../src/components/CustomLayout/MaiLayout";
import Layout from "../../src/components/Layout";

function Mails() {
    return <div>test</div>;
}

Mails.getLayout = function getLayout(page) {
    return (
        <Layout disableContentMargin={true}>
            <MailLayout>{page}</MailLayout>
        </Layout>
    );
};

Mails.Auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["PTTPK", "MASTER"]
};

export default Mails;
