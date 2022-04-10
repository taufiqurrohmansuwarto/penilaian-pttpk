import { useRouter } from "next/router";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
    createPost,
    findCommunities
} from "../../../../services/main.services";
import Layout from "../../../../src/components/Layout";
import Post from "../../../../src/components/reddits/Post";

function SubRedditSubmit() {
    const { query } = useRouter();
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

    const createMutation = useMutation((data) => createPost(data), {});

    const handleSubmit = () => {
        const data = { title, description };
        const id = query?.sub;
        console.log(data, id);
    };

    return (
        <Layout>
            {JSON.stringify(dataCommunities)}
            <Post
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
