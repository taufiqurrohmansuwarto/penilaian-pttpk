import { Comment, Input } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

const { TextArea } = Input;

const Editor = ({ router, route }) => {
    const handleFocus = () => {
        router.push(route);
    };

    return (
        <>
            <TextArea
                placeholder="Buat Postingan"
                onFocus={handleFocus}
                rows={4}
            />
        </>
    );
};

function CreatePost({ route }) {
    const { data } = useSession();
    const router = useRouter();

    return (
        <Comment
            avatar={data?.user?.image}
            content={<Editor route={route} router={router} />}
        />
    );
}

export default CreatePost;
