import React from "react";
import Layout from "../../../../src/components/Layout";

function SubRedditSubmit() {
    return <Layout>submit</Layout>;
}

SubRedditSubmit.auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["MASTER", "PTTPK"]
};

export default SubRedditSubmit;
