import { message } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
    createPostByCommunities,
    findCommunities
} from "../../../../services/main.services";
import Layout from "../../../../src/components/Layout";
import Post from "../../../../src/components/reddits/Post";

function SubRedditSubmit() {
    const router = useRouter();
    const { query } = router;
    const { data: dataCommunities } = useQuery(
        ["communities", query?.sub],
        () => findCommunities(query?.sub),
        {
            enabled: !!query?.sub
        }
    );

    const [title, setTitle] = useState();
    const [description, onChange] = useState();

    const onChangeTitle = (e) => setTitle(e?.target?.value);

    const createMutation = useMutation(
        (data) => createPostByCommunities(data),
        {
            onSuccess: () => {
                router.push(`/discussions/r/${query?.sub}`);
                message.success("Sukses Membuat postingan");
            }
        }
    );

    const handleSubmit = () => {
        const data = { title, description };
        const id = query?.sub;
        const values = { data, title: id };
        createMutation.mutate(values);
    };

    return (
        <Layout title={query?.sub}>
            {JSON.stringify(dataCommunities)}
            <Post
                loading={createMutation?.isLoading}
                title={title}
                onChangeTitle={onChangeTitle}
                description={description}
                onChangeDescription={onChange}
                handleSubmit={handleSubmit}
            />
        </Layout>
    );
}

SubRedditSubmit.auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["MASTER", "PTTPK"]
};

export default SubRedditSubmit;
