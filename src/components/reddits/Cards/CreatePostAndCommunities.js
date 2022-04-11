import { Button, Card, Space } from "antd";
import { useRouter } from "next/router";
import React from "react";

function CreatePostAndCommunities() {
    const router = useRouter();

    const createPost = () => {
        router.push("/discussions/submit");
    };
    const createCommunities = () => {
        router.push("/discussions/komunitas/create");
    };

    return (
        <Card>
            <Card.Meta
                title="Ayo buat postingan / komunitas baru"
                description="Heheheheh"
            />
            <div style={{ marginTop: 8 }}>
                <Button
                    type="primary"
                    onClick={createPost}
                    block
                    style={{ marginBottom: 8 }}
                >
                    Buat Post
                </Button>
                <Button block onClick={createCommunities}>
                    Buat Komunitas
                </Button>
            </div>
        </Card>
    );
}

export default CreatePostAndCommunities;
