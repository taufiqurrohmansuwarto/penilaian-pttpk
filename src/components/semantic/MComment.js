import { Popconfirm } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Comment, Icon } from "semantic-ui-react";
import { likes } from "../../../services/main.services";
import { capitalCase } from "../../../utils/utility";

const UserAction = ({ hasAction, id }) => {
    if (!hasAction) {
        return null;
    } else {
        return (
            <>
                <Comment.Action>Edit</Comment.Action>
                <Popconfirm title="Apakah kamu yakin ingin menghapus?">
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
    sort,
    totalComments
}) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [editId, setEditId] = useState(null);

    const handleEdit = (currentId) => {
        setEditId(currentId);
    };

    const { mutate: likeMutate } = useMutation((data) => likes(data), {
        onSuccess: (hasil) => {
            queryClient.setQueryData(["comments", "detail", hasil?.id], hasil);
            queryClient.setQueryData(
                ["comments", "filter", sort],
                (previous) => {
                    const kumat = previous?.pages?.map((p) => {
                        const data = p?.data?.map((x) =>
                            x.id === hasil?.id ? hasil : x
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

    const handleLikes = () => {
        likeMutate(id);
    };

    const gotoDetail = () => {
        router.push(`/feeds/${id}`);
    };

    return (
        <Comment.Group>
            <Comment>
                <Comment.Avatar src={image} />
                <Comment.Content>
                    <Comment.Author as="a">
                        {capitalCase(username)}
                    </Comment.Author>
                    <Comment.Metadata>
                        <div>{moment(date).fromNow()}</div>
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
                            <Icon name="comment outline" /> {totalComments}
                        </Comment.Action>
                        <UserAction hasAction={hasAction} id={id} />
                    </Comment.Actions>
                </Comment.Content>
            </Comment>
        </Comment.Group>
    );
}

export default MComment;
