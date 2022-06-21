// ini adalah halaman esign
import React from "react";
import EsignLayout from "../../../../src/components/Layout/EsignLayout";
import PageContainer from "../../../../src/components/PageContainer";

function Expired() {
    return (
        <PageContainer title="Documents" subTitle="All">
            <div>halaman untuk melihat semua dokumen</div>
        </PageContainer>
    );
}

Expired.Auth = {
    roles: ["USER"],
    groups: ["MASTER"]
};

Expired.getLayout = function getLayout(page) {
    return <EsignLayout>{page}</EsignLayout>;
};

export default Expired;
