// ini adalah halaman esign
import React from "react";
import EsignLayout from "../../../../src/components/Layout/EsignLayout";
import PageContainer from "../../../../src/components/PageContainer";

function All() {
    return (
        <PageContainer title="Documents" subTitle="All">
            <div>halaman untuk melihat semua dokumen</div>
        </PageContainer>
    );
}

All.Auth = {
    roles: ["USER"],
    groups: ["MASTER"]
};

All.getLayout = function getLayout(page) {
    return <EsignLayout>{page}</EsignLayout>;
};

export default All;
