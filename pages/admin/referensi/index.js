import React from "react";
import AdminLayout from "../../../src/components/AdminLayout";
import PageContainer from "../../../src/components/PageContainer";

function Referensi() {
    return <PageContainer>test</PageContainer>;
}

Referensi.Auth = {
    isAdmin: true
};

Referensi.getLayout = function getLayout(page) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default Referensi;
