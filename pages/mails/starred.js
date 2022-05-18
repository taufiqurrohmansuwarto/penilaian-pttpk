import React from "react";
import MailLayout from "../../src/components/CustomLayout/MaiLayout";
import Layout from "../../src/components/Layout";

function Starred() {
    return <div>test</div>;
}

Starred.getLayout = function getLayout(page) {
    return (
        <Layout disableContentMargin={true}>
            <MailLayout>{page}</MailLayout>
        </Layout>
    );
};

Starred.Auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["PTTPK", "MASTER"]
};

export default Starred;
