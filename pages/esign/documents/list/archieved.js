// ini adalah halaman esign
import React from "react";
import EsignLayout from "../../../../src/components/Layout/EsignLayout";
import PageContainer from "../../../../src/components/PageContainer";

function Archieved() {
    return (
        <PageContainer title="Documents" subTitle="All">
            <div>halaman untuk melihat semua dokumen</div>
        </PageContainer>
    );
}

Archieved.Auth = {
    roles: ["USER"],
    groups: ["MASTER"]
};

Archieved.getLayout = function getLayout(page) {
    return <EsignLayout>{page}</EsignLayout>;
};

export default Archieved;
