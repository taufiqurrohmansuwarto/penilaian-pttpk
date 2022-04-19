import { Card, message } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
    createPostByCommunities,
    findCommunities
} from "../../../../services/main.services";
import Layout from "../../../../src/components/Layout";
import PageContainer from "../../../../src/components/PageContainer";
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
        if (!title || !description) {
            return;
        } else {
            const data = { title, description };
            const id = query?.sub;
            const values = { data, title: id };
            createMutation.mutate(values);
        }
    };

    return (
        <Layout title={`Buat Postingan di Komunitasi ${query?.sub}`}>
            <PageContainer title="Buat Postingan" content="Isikan postinganmu">
                <Card>
                    <Post
                        loading={createMutation?.isLoading}
                        title={title}
                        onChangeTitle={onChangeTitle}
                        description={description}
                        onChangeDescription={onChange}
                        handleSubmit={handleSubmit}
                    />
                </Card>
            </PageContainer>
        </Layout>
    );
}

SubRedditSubmit.auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["MASTER", "PTTPK"]
};

export default SubRedditSubmit;
