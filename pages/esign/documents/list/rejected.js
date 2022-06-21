// ini adalah halaman esign
import React from "react";
import EsignLayout from "../../../../src/components/Layout/EsignLayout";
import PageContainer from "../../../../src/components/PageContainer";

function Rejected() {
    return (
        <PageContainer title="Documents" subTitle="All">
            <div>Rejected document</div>
        </PageContainer>
    );
}

Rejected.Auth = {
    roles: ["USER"],
    groups: ["MASTER"]
};

Rejected.getLayout = function getLayout(page) {
    return <EsignLayout>{page}</EsignLayout>;
};

export default Rejected;
