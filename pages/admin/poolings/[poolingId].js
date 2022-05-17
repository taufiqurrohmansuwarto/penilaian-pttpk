import { useRouter } from "next/router";
import React from "react";
import AdminLayout from "../../../src/components/AdminLayout";
import PageContainer from "../../../src/components/PageContainer";

function Detail() {
    const router = useRouter();

    return (
        <PageContainer
            onBack={() => router.back()}
            style={{ minHeight: "95vh" }}
            title="Detail"
        >
            hello
        </PageContainer>
    );
}

Detail.Auth = {
    isAdmin: true
};

Detail.getLayout = function getLayout(page) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default Detail;
