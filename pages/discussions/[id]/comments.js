import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { getCommentsByPost } from "../../../services/main.services";
import Layout from "../../../src/components/Layout";
import CreateComments from "../../../src/components/reddits/CreateComments";

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
            <CreateComments data={dataComments} id={router?.query?.id} />
        </Layout>
    );
}

Comments.auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["MASTER", "PTTPK"]
};

export default Comments;
