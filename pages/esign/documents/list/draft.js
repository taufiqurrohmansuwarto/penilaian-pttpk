// ini adalah halaman esign
import React from "react";
import EsignLayout from "../../../../src/components/Layout/EsignLayout";
import PageContainer from "../../../../src/components/PageContainer";

function Draft() {
    return (
        <PageContainer title="Documents" subTitle="Draft">
            <div>halaman untuk melihat draft dokumen</div>
        </PageContainer>
    );
}

Draft.Auth = {
    roles: ["USER"],
    groups: ["MASTER"]
};

Draft.getLayout = function getLayout(page) {
    return <EsignLayout>{page}</EsignLayout>;
};

export default Draft;
