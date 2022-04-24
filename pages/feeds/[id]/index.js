import { Skeleton } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { detailComment } from "../../../services/main.services";
import Layout from "../../../src/components/Layout";
import PageContainer from "../../../src/components/PageContainer";

function DetailFeed() {
    const router = useRouter();
    const { data, isLoading } = useQuery(
        ["detail-comments", router?.query?.id],
        () => detailComment(router?.query?.id),
        {
            enabled: !!router?.query?.id
        }
    );

    return (
        <Layout>
            <PageContainer title="Detail" subTitle="Postingan">
                {JSON.stringify(data)}
            </PageContainer>
        </Layout>
    );
}

DetailFeed.Auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["MASTER", "PTTPK"]
};

export default DetailFeed;
