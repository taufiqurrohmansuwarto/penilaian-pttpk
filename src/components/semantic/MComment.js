import { message, Popconfirm } from "antd";
import moment from "moment";
import "moment/locale/id";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Comment, Icon } from "semantic-ui-react";
import {
    likes,
    removeComment,
    updateComment
} from "../../../services/main.services";
import { capitalCase } from "../../../utils/utility";
import MCreateComment from "./MCreateComment";
moment.locale("id");

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

function MComment({
    id,
    image,
    hasAction,
    username,
    date,
    comment,
    isLike,
    totalLikes,
    userId,
    sort,
    totalComments
}) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [editId, setEditId] = useState(null);
    const [editText, setEditText] = useState(null);

    const showEdit = () => {
        setEditId(id);
        setEditText(comment);
    };

    const closeEdit = () => {
        setEditId(null);
        setEditText(null);
    };

    const { mutate: remove } = useMutation((id) => removeComment(id), {
        onSuccess: (id) => {
            queryClient.setQueryData(
                ["comments", "filter", sort],
                (previous) => {
                    const kumat = previous?.pages?.map((p) => {
                        const data = p?.data?.filter((x) => x?.id !== id);
                        const nextCursor = p?.nextCursor;

                        const hasil = { data, nextCursor };

                        return hasil;
                    });

                    return {
                        ...previous,
                        pages: kumat
                    };
                }
            );

            queryClient.invalidateQueries({
                queryKey: ["comments", "filter"],
                refetchActive: false
            });

            message.success("Berhasil dihapus");
        }
    });

    const handleRemove = () => {
        remove(id);
    };

    const { mutate: likeMutate } = useMutation((data) => likes(data), {
        onSuccess: (hasil) => {
            queryClient.setQueryData(["comments", "detail", hasil?.id], hasil);
            queryClient.setQueryData(
                ["comments", "filter", sort],
                (previous) => {
                    const kumat = previous?.pages?.map((p) => {
                        const data = p?.data?.map((x) =>
                            x.id === hasil?.id
                                ? {
                                      ...x,
                                      comments_likes: hasil?.comments_likes,
                                      _count: hasil?._count
                                  }
                                : x
                        );
                        const nextCursor = p?.nextCursor;

                        return {
                            data,
                            nextCursor
                        };
                    });

                    return {
                        ...previous,
                        pages: kumat
                    };
                }
            );

            queryClient.invalidateQueries({
                queryKey: ["comments", "filter"],
                refetchActive: false
            });
        }
    });

    const { mutate: editComment } = useMutation((data) => updateComment(data), {
        onSuccess: (result) => {
            queryClient.setQueryData(
                ["comments", "filter", sort],
                (previous) => {
                    const kumat = previous?.pages?.map((p) => {
                        const data = p?.data?.map((x) =>
                            x?.id === result?.id ? result : x
                        );
                        const nextCursor = p?.nextCursor;

                        const hasil = { data, nextCursor };

                        return hasil;
                    });

                    return {
                        ...previous,
                        pages: kumat
                    };
                }
            );

            queryClient.invalidateQueries({
                queryKey: ["comments", "filter"],
                refetchActive: false
            });

            message.success("Komentar berhasil diedit");

            setEditId(null);
            setEditText(null);
        }
    });

    const handleSubmitEdit = () => {
        const data = { id, comment: editText };
        editComment(data);
    };

    const handleLikes = () => {
        likeMutate(id);
    };

    const gotoDetail = () => {
        router.push(`/feeds/${id}`);
    };

    return (
        <Comment.Group>
            <Comment>
                {editId === id ? (
                    <MCreateComment
                        handleClose={closeEdit}
                        text={editText}
                        setText={setEditText}
                        handleSubmit={handleSubmitEdit}
                        buttonText="Edit"
                    />
                ) : (
                    <>
                        <Comment.Avatar src={image} />
                        <Comment.Content>
                            <Comment.Author
                                as="a"
                                onClick={() =>
                                    router?.push(`/profile/user/${userId}`)
                                }
                            >
                                {capitalCase(username)}
                            </Comment.Author>
                            <Comment.Metadata>
                                <div>&#x2022; {moment(date).fromNow()}</div>
                            </Comment.Metadata>
                            <Comment.Text>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: comment
                                    }}
                                />
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
                                <Comment.Action onClick={gotoDetail}>
                                    <Icon name="comment outline" />{" "}
                                    {totalComments}
                                </Comment.Action>
                                <UserAction
                                    hasAction={hasAction}
                                    id={id}
                                    remove={handleRemove}
                                    edit={showEdit}
                                />
                                <Comment.Action>Laporkan</Comment.Action>
                            </Comment.Actions>
                        </Comment.Content>
                    </>
                )}
            </Comment>
        </Comment.Group>
    );
}

export default MComment;
