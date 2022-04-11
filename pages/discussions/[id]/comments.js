import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { getCommentsByPost } from "../../../services/main.services";
import Layout from "../../../src/components/Layout";

function Comments() {
    const router = useRouter();

    const { data: dataComments, isLoading } = useQuery(
        ["comments", router?.query?.id],
        () => getCommentsByPost(router?.query?.id),
        {
            enabled: !!router?.query?.id
        }
    );

    return (
        <Layout>
            <div>{JSON.stringify(dataComments)}</div>
        </Layout>
    );
}

Comments.auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["MASTER", "PTTPK"]
};

export default Comments;
