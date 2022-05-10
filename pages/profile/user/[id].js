import React from "react";
import Layout from "../../../src/components/Layout";
import PageContainer from "../../../src/components/PageContainer";

function Profile() {
    return (
        <PageContainer style={{ minHeight: "100vh" }} title="Profile">
            Hello world
        </PageContainer>
    );
}

Profile.Auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["PTTPK", "MASTER"]
};

Profile.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default Profile;
