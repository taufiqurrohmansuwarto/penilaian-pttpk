import { Button, Typography } from "antd";
import React from "react";
import { useQuery } from "react-query";
import { getMail } from "../../services/main.services";
import MailLayout from "../../src/components/CustomLayout/MaiLayout";
import Layout from "../../src/components/Layout";

function Sents() {
    const { data, isLoading } = useQuery(["mails", "sent"], () =>
        getMail("sent")
    );
    return <div>{JSON.stringify(data)}</div>;
}

Sents.getLayout = function getLayout(page) {
    return (
        <Layout disableContentMargin={true}>
            <MailLayout>{page}</MailLayout>
        </Layout>
    );
};

Sents.Auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["PTTPK", "MASTER"]
};

export default Sents;
