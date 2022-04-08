import { Comment, Input } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";

const { TextArea } = Input;

const Editor = ({ onChange, value, router }) => {
    const handleFocus = () => {
        router.push("test");
    };

    return (
        <>
            <TextArea
                onFocus={handleFocus}
                rows={4}
                onChange={onChange}
                value={value}
            />
        </>
    );
};

function CreatePost() {
    const { data } = useSession();
    const router = useRouter();

    const [message, setMessage] = useState();

    const handleChange = (e) => {
        setMessage(e?.target.value);
    };

    const handleSubmit = () => {};

    return (
        <Comment
            avatar={data?.user?.image}
            content={
                <Editor
                    router={router}
                    value={message}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                />
            }
        />
    );
}

export default CreatePost;
