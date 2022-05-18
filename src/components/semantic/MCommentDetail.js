import { Blockquote, Button, TypographyStylesProvider } from "@mantine/core";
import { message, Popconfirm } from "antd";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Comment, Icon } from "semantic-ui-react";
import {
    createComments,
    likes,
    removeComment,
    updateComment
} from "../../../services/main.services";
import { capitalCase } from "../../../utils/utility";
import MCreateComment from "./MCreateComment";

const SubComment = ({ subComment }) => {
    const { data } = useSession();
    const [idReplySubComment, setIdReplySubComment] = useState(null);
    const [textReplySubComment, setTextReplySubComment] = useState(null);

    const [idEditSubComment, setIdEditSubComment] = useState(null);
    const [textEditSubComment, setTextEditSubComment] = useState(null);
    const router = useRouter();

    const queryClient = useQueryClient();
    const { mutate: addSubComment } = useMutation(
        (data) => createComments(data),
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries([
                    "comments",
                    "detail",
                    data?.parent_id
                ]);
                message.success("Berhasil menambahkan komentar");
                setTextReplySubComment(null);
                setIdReplySubComment(null);
            }
        }
    );

    const { mutate: editComment } = useMutation((data) => updateComment(data), {
        onSuccess: () => {
            queryClient.invalidateQueries(["comments"]);
            message.success("Komentar berhasil diedit");
            setIdEditSubComment(null);
            setTextEditSubComment(null);
        }
    });

    const handleSubmitEdit = (comment) => {
        const data = { id: comment?.id, comment: textEditSubComment };
        editComment(data);
    };

    const showEdit = (comment) => {
        setIdEditSubComment(comment?.id);
        setTextEditSubComment(comment?.comment);
    };

    const closeEdit = (comment) => {
        setIdEditSubComment(null);
        setTextEditSubComment(null);
    };

    const { mutate: remove } = useMutation((data) => removeComment(data), {
        onSuccess: () => {
            queryClient.invalidateQueries(["comments"]);
            message.success("Berhasil menghapus");
        }
    });

    const handleRemove = (id) => {
        remove(id);
    };

    const handleAddSubComment = (comment) => {
        const data = {
            parent_id: comment?.parent_id,
            comment: textReplySubComment
        };
        addSubComment(data);
    };

    const handleReplySubComment = (id, user) => {
        setIdReplySubComment(id);
        setTextReplySubComment(
            `<p><span class="mention" data-index="0" data-denotation-char="@" data-id="${user?.custom_id}" data-value="<a href=&quot;http://google.com&quot; target=_blank>${user?.username}" data-link="http://google.com">﻿<span contenteditable="false"><span class="ql-mention-denotation-char">@</span><a href="http://google.com" target="_blank">${user?.username}</a></span>﻿</span> </p>`
        );
    };

    const closeReplySubComment = () => {
        setIdReplySubComment(null);
        setTextReplySubComment(null);
    };

    if (subComment?.length === 0) {
        return null;
    }

    return (
        <>
            {subComment?.map((comment) => (
                <Comment key={comment?.id}>
                    {idEditSubComment === comment?.id ? (
                        <MCreateComment
                            text={textEditSubComment}
                            setText={setTextEditSubComment}
                            handleClose={() => closeEdit(comment)}
                            handleSubmit={() => handleSubmitEdit(comment)}
                        />
                    ) : (
                        <>
                            <Comment.Avatar src={comment?.user?.image} />
                            <Comment.Content>
                                <Comment.Author
                                    as="a"
                                    onClick={() =>
                                        router?.push(
                                            `/profile/user/${comment?.user?.custom_id}`
                                        )
                                    }
                                >
                                    {capitalCase(comment?.user?.username)}
                                </Comment.Author>
                                <Comment.Metadata>
                                    <div>
                                        &#x2022;{" "}
                                        {moment(comment?.created_at).fromNow()}
                                    </div>
                                </Comment.Metadata>
                                <Comment.Text>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: comment?.comment
                                        }}
                                    />
                                </Comment.Text>
                                <Comment.Actions>
                                    <Comment.Action
                                        onClick={() =>
                                            handleReplySubComment(
                                                comment?.id,
                                                comment?.user
                                            )
                                        }
                                    >
                                        Balas
                                    </Comment.Action>
                                    <UserAction
                                        id={comment?.id}
                                        hasAction={
                                            data?.user?.id ===
                                            comment?.user?.custom_id
                                        }
                                        edit={() => showEdit(comment)}
                                        remove={() => handleRemove(comment?.id)}
                                    />
                                </Comment.Actions>
                            </Comment.Content>
                            {idReplySubComment === comment?.id && (
                                <MCreateComment
                                    handleClose={closeReplySubComment}
                                    text={textReplySubComment}
                                    setText={setTextReplySubComment}
                                    handleSubmit={() =>
                                        handleAddSubComment(comment)
                                    }
                                />
                            )}
                        </>
                    )}
                </Comment>
            ))}
        </>
    );
};

const UserAction = ({ hasAction, remove, edit }) => {
    if (!hasAction) {
        return null;
    } else {
        return (
            <>
                <Comment.Action onClick={edit}>Edit</Comment.Action>
                <Popconfirm
                    title="Apakah kamu yakin ingin menghapus?"
                    onConfirm={remove}
                >
                    <Comment.Action>Hapus</Comment.Action>
                </Popconfirm>
            </>
        );
    }
};

function MCommentDetail({
    id,
    image,
    hasAction,
    username,
    date,
    comment,
    isLike,
    totalLikes,
    user,
    subComment,
    userId
}) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [editId, setEditId] = useState(null);
    const [editText, setEditText] = useState(null);

    const handleCloseEdit = () => {
        setEditId(null);
        setEditText(null);
    };

    const [replyId, setReplyId] = useState(null);

    // add comment
    const [text, setText] = useState(null);

    const handleEdit = () => {
        setEditId(id);
        setEditText(comment);
    };

    const { mutate: remove } = useMutation((id) => removeComment(id), {
        onSuccess: (id) => {
            queryClient.invalidateQueries(["comments", "detail", id]);
        }
    });

    const handleRemove = () => {
        remove(id);
    };

    const { mutate: likeMutate } = useMutation((data) => likes(data), {
        onSuccess: () => {
            queryClient.invalidateQueries(["comments", "detail", id]);
        }
    });

    const { mutate: addComment } = useMutation((data) => createComments(data), {
        onSuccess: () => {
            queryClient.invalidateQueries(["comments", "detail", id]);
            setText(null);
            setReplyId(null);
            message.success("Berhasil menambahkan komentar");
        }
    });

    const { mutate: update } = useMutation((data) => updateComment(data), {
        onSuccess: () => {
            queryClient.invalidateQueries(["comments", "detail", id]);
            setEditText(null);
            setEditId(null);
            message.success("Komentar berhasil diedit");
        }
    });

    const handleSubmitEdit = () => {
        const data = { id, comment: editText };
        update(data);
    };

    const handleAddComment = () => {
        const data = { parent_id: replyId, comment: text };
        addComment(data);
    };

    const handleLikes = () => {
        likeMutate(id);
    };

    const handleReply = () => {
        setReplyId(id);
        setText(
            `<p><span class="mention" data-index="0" data-denotation-char="@" data-id="${user?.custom_id}" data-value="<a href=&quot;http://google.com&quot; target=_blank>${user?.username}" data-link="http://google.com">﻿<span contenteditable="false"><span class="ql-mention-denotation-char">@</span><a href="http://google.com" target="_blank">${user?.username}</a></span>﻿</span> </p>`
        );
    };

    const handleClose = () => {
        setReplyId(null);
    };

    return (
        <>
            <Comment.Group size="large">
                <Comment>
                    {editId === id ? (
                        <MCreateComment
                            text={editText}
                            buttonText="Edit"
                            setText={setEditText}
                            handleClose={handleCloseEdit}
                            handleSubmit={handleSubmitEdit}
                        />
                    ) : (
                        <>
                            <Comment.Avatar src={image} />
                            <Comment.Content>
                                <Comment.Author
                                    as="a"
                                    onClick={() =>
                                        router.push(`/profile/user/${userId}`)
                                    }
                                >
                                    {capitalCase(username)}
                                </Comment.Author>
                                <Comment.Metadata>
                                    <div>&#x2022; {moment(date).fromNow()}</div>
                                </Comment.Metadata>
                                <Comment.Text>
                                    <TypographyStylesProvider>
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: comment
                                            }}
                                        />
                                    </TypographyStylesProvider>
                                </Comment.Text>
                                <Comment.Actions>
                                    <Comment.Action>
                                        <Icon
                                            name="like"
                                            color={isLike ? "red" : null}
                                            onClick={handleLikes}
                                        />
                                        {totalLikes}
                                    </Comment.Action>
                                    <Comment.Action onClick={handleReply}>
                                        Balas
                                    </Comment.Action>
                                    <UserAction
                                        hasAction={hasAction}
                                        id={id}
                                        remove={handleRemove}
                                        edit={handleEdit}
                                    />
                                    <Comment.Action>Laporkan</Comment.Action>
                                </Comment.Actions>
                            </Comment.Content>
                        </>
                    )}
                    <Comment.Group size="small">
                        {replyId === id && (
                            <MCreateComment
                                text={text}
                                setText={setText}
                                handleSubmit={handleAddComment}
                                handleClose={handleClose}
                            />
                        )}
                        <SubComment subComment={subComment} />
                    </Comment.Group>
                </Comment>
            </Comment.Group>
        </>
    );
}

export default MCommentDetail;
