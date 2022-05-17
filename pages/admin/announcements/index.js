import React from "react";
import AdminLayout from "../../../src/components/AdminLayout";
import PageContainer from "../../../src/components/PageContainer";

function Announcements() {
    return (
        <PageContainer style={{ minHeight: "95vh" }}>Hello world</PageContainer>
    );
}

Announcements.Auth = {
    isAdmin: true
};

Announcements.getLayout = function getLayout(page) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default Announcements;
