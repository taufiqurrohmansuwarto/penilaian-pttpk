// ini adalah halaman esign
import React from "react";
import EsignLayout from "../../src/components/Layout/EsignLayout";
import PageContainer from "../../src/components/PageContainer";

function Dashboard() {
    return (
        <PageContainer title="Dashboard" subTitle="E-Sign">
            <div>Ini adalah halaman dashboard esign</div>
        </PageContainer>
    );
}

Dashboard.Auth = {
    roles: ["USER"],
    groups: ["MASTER"]
};

Dashboard.getLayout = function getLayout(page) {
    return <EsignLayout>{page}</EsignLayout>;
};

export default Dashboard;
