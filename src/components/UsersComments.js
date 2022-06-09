import { Alert } from "@mantine/core";
import { Comment, Divider, List, message, Spin } from "antd";
import CheckableTag from "antd/lib/tag/CheckableTag";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { Antenna } from "tabler-icons-react";
import {
    createComments,
    dislikes,
    getComments,
    likes,
    removeComment,
    updateComment
} from "../../services/main.services";
import CustomRichTextEditor from "./CustomRichTextEditor";
import Pengumuman from "./Pengumuman";
import MComment from "./semantic/MComment";
import MListLoading from "./semantic/MListLoading";

const ListComments = ({ data, user, sort }) => {
    return (
        <div>
            {data?.length ? (
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    size="small"
                    rowKey={(row) => row?.id}
                    renderItem={(item) => (
                        <List.Item>
                            <MComment
                                sort={sort}
                                id={item?.id}
                                key={item?.id}
                                image={item?.user?.image}
                                userId={item?.user?.custom_id}
                                comment={item?.comment}
                                hasAction={
                                    item?.user?.custom_id === user?.user?.id
                                }
                                totalComments={item?._count?.children}
                                totalLikes={item?._count?.comments_likes}
                                isLike={!!item?.comments_likes?.length}
                                date={item?.created_at}
                                username={item?.user?.username}
                            />
                        </List.Item>
                    )}
                />
            ) : null}
        </div>
    );
};

// todo implement likes, filter
const UserComments = ({ sort }) => {
    const filter = ["terbaru", "like", "popular", "me"];
    const router = useRouter();

    const [selectedFilter, setSelectedFilter] = useState(sort);

    const [comment, setComment] = useState("");

    const { data: userData } = useSession();
    const {
        data: dataComments,
        isFetchingNextPage,
        isFetching,
        fetchNextPage,
        hasNextPage
    } = useInfiniteQuery(
        ["comments", "filter", sort],
        ({ pageParam }) => {
            return getComments({ cursor: pageParam, sort });
        },
        {
            getNextPageParam: (pageParams) =>
                pageParams?.nextCursor ?? undefined,
            enabled: !!sort
        }
    );

    const queryClient = useQueryClient();

    const createCommentMutation = useMutation((data) => createComments(data), {
        onSuccess: (result) => {
            queryClient.setQueryData(
                ["comments", "filter", sort],
                (previous) => {
                    const kumat = previous?.pages?.map((p) => {
                        const data = [result, ...p?.data];
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

            setComment("");
            message.success("Berhasil");
        },
        onError: (e) => {
            console.log(e);
        }
    });

    useEffect(() => {}, [sort]);

    const handleSubmit = () => {
        const data = { comment, parent_id: null };

        const hasil = comment.replace(/<(.|\n)*?>/g, "").trim();
        if (hasil.length === 0) {
            return;
        } else {
            createCommentMutation.mutate(data);
        }
    };

    const likeMutation = useMutation((data) => likes(data), {
        onSuccess: () => queryClient.invalidateQueries("comments")
    });
    const dislikeMutation = useMutation((data) => dislikes(data), {
        onSuccess: () => queryClient.invalidateQueries("comments")
    });

    const removeMutation = useMutation((data) => removeComment(data), {
        onSuccess: () => queryClient.invalidateQueries("comments")
    });

    const updateMutation = useMutation((data) => updateComment(data), {
        onSuccess: () => queryClient.invalidateQueries("comments")
    });

    const handleLike = (data) => likeMutation.mutate(data);
    const handleDislike = (data) => dislikeMutation.mutate(data);
    const handleRemove = (data) => removeMutation.mutate(data);
    const handleUpdate = async (data) => {
        updateMutation.mutateAsync(data);
    };

    const handleChangeFilter = (a, b) => {
        if (a) {
            setSelectedFilter(b);
            router.push(
                {
                    query: {
                        sort: b
                    }
                },
                undefined,
                { scroll: false }
            );
        }
    };

    return (
        <>
            <Pengumuman />
            <Comment
                avatar={userData?.user?.image}
                content={
                    <>
                        <CustomRichTextEditor
                            placeholder="Apa yang ingin kamu bagikan hari ini??"
                            text={comment}
                            main={true}
                            setText={setComment}
                            handleSubmit={handleSubmit}
                        />
                    </>
                }
            />
            <Divider />
            {filter?.map((f) => (
                <CheckableTag
                    key={f}
                    checked={selectedFilter === f}
                    onChange={(checked) => handleChangeFilter(checked, f)}
                >
                    {f}
                </CheckableTag>
            ))}
            <Divider />
            <MListLoading loading={isFetching}>
                {dataComments?.pages?.map((page) => (
                    <React.Fragment key={page?.nextCursor}>
                        <InfiniteScroll
                            next={fetchNextPage}
                            hasMore={hasNextPage}
                            loader={isFetchingNextPage ? <Spin /> : null}
                            dataLength={page?.data?.length}
                        >
                            <ListComments
                                sort={sort}
                                user={userData}
                                data={page?.data}
                                mutation={createCommentMutation}
                                handleLike={handleLike}
                                handleDislike={handleDislike}
                                handleRemove={handleRemove}
                                handleUpdate={handleUpdate}
                            />
                        </InfiniteScroll>
                    </React.Fragment>
                ))}
            </MListLoading>
        </>
    );
};

export default UserComments;
