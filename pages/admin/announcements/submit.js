import React from "react";
import AdminLayout from "../../../src/components/AdminLayout";
import PageContainer from "../../../src/components/PageContainer";

function Submit() {
    return (
        <PageContainer style={{ minHeight: "95vh" }}>Hello world</PageContainer>
    );
}

Submit.Auth = {
    isAdmin: true
};

Submit.getLayout = function getLayout(page) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default Submit;
