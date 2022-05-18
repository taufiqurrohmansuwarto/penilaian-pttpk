import React from "react";
import AdminLayout from "../../../src/components/AdminLayout";
import PageContainer from "../../../src/components/PageContainer";

function Edit() {
    return (
        <PageContainer style={{ minHeight: "95vh" }}>Hello world</PageContainer>
    );
}

Edit.Auth = {
    isAdmin: true
};

Edit.getLayout = function getLayout(page) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default Edit;
