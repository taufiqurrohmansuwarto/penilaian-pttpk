import React from "react";
import { useQuery } from "react-query";
import { getMail } from "../../services/main.services";
import MailLayout from "../../src/components/CustomLayout/MaiLayout";
import Layout from "../../src/components/Layout";

function Mails() {
    const { data, isLoading } = useQuery(["mails", "inbox"], () =>
        getMail("inbox")
    );

    return <div>{JSON.stringify(data)}</div>;
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
