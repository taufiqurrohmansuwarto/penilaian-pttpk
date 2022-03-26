import {
    Tooltip,
    Button,
    Comment,
    Form,
    Input,
    List,
    message,
    Skeleton,
    Space
} from "antd";
import moment from "moment";
import "moment/locale/id";
import { useSession } from "next-auth/react";
import React, { useState, createElement } from "react";
import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient
} from "react-query";
import { createComments, getComments } from "../../services/main.services";

moment.locale("id");

const { TextArea } = Input;

const Editor = ({
    main,
    onChange,
    onSubmit,
    submitting,
    value,
    onCancel,
    buttonText = "Apa yang kamu kerjakan hari ini?"
}) => (
    <div>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value} />
        </Form.Item>
        <Form.Item>
            <Space>
                <Button
                    htmlType="submit"
                    loading={submitting}
                    onClick={onSubmit}
                    type="primary"
                >
                    {buttonText}
                </Button>
                {!main && <Button onClick={onCancel}>Cancel</Button>}
            </Space>
        </Form.Item>
    </div>
);

const ChildrenComment = ({ data }) => {
    return (
        <div>
            {data?.length > 0 ? (
                <List
                    itemLayout="horizontal"
                    header={`${data?.length} balasan`}
                    dataSource={data}
                    renderItem={(item) => {
                        return (
                            <li>
                                <Comment
                                    avatar={item?.avatar}
                                    author={item?.nama}
                                    content={item?.comment}
                                    datetime={moment(
                                        item?.created_at
                                    ).fromNow()}
                                />
                            </li>
                        );
                    }}
                />
            ) : null}
        </div>
    );
};

const ListComments = ({ data, isLoading, user, mutation, show = true }) => {
    const [id, setId] = useState(null);
    const handleShowEditor = (currentId) => {
        setId(currentId);
        setComment("");
    };

    const [comment, setComment] = useState("");

    const handleSubmit = async (id) => {
        const data = { parent_id: id, comment };
        console.log(data);
        if (!comment) {
            return;
        } else {
            await mutation.mutateAsync(data);
            setComment("");
            setId(null);
            setVisibleChildrenComment(id);
        }
    };

    const handleCancel = () => setId(null);

    const [visibleChildrenComment, setVisibleChildrenComment] = useState(null);

    const toggleChildrenComment = (id) => {
        if (visibleChildrenComment === id) {
            setVisibleChildrenComment(null);
        } else {
            setVisibleChildrenComment(id);
        }
    };

    return (
        <div>
            {data?.length ? (
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    loading={isLoading}
                    renderItem={(item) => (
                        <li>
                            <Comment
                                actions={[
                                    <span
                                        onClick={() =>
                                            handleShowEditor(item?.id)
                                        }
                                    >
                                        Balas
                                    </span>,
                                    <>
                                        {item?.children?.length ? (
                                            <span
                                                onClick={() =>
                                                    toggleChildrenComment(
                                                        item?.id
                                                    )
                                                }
                                            >
                                                {visibleChildrenComment ===
                                                item?.id
                                                    ? "Tutup"
                                                    : "Buka"}{" "}
                                                {item?.children?.length} balasan
                                            </span>
                                        ) : null}
                                    </>
                                ]}
                                content={item?.comment}
                                datetime={moment(item?.created_at).fromNow()}
                                author={item?.nama}
                                avatar={item?.avatar}
                            >
                                {id === item?.id && (
                                    <Comment
                                        author={user?.user?.name}
                                        avatar={user?.user?.image}
                                    >
                                        <Editor
                                            buttonText="Balas"
                                            value={comment}
                                            onSubmit={() =>
                                                handleSubmit(item?.id)
                                            }
                                            onCancel={handleCancel}
                                            onChange={(e) =>
                                                setComment(e?.target.value)
                                            }
                                        />
                                    </Comment>
                                )}
                                {visibleChildrenComment === item?.id ? (
                                    <ChildrenComment
                                        show={show}
                                        data={item?.children}
                                    />
                                ) : null}
                            </Comment>
                        </li>
                    )}
                />
            ) : null}
        </div>
    );
};

// todo implement likes, filter
const UserComments = () => {
    const filter = ["Terbaru", "Terpopuler"];

    const [selectedFilter, setSelectedFilter] = useState(["Terbaru"]);

    const [comment, setComment] = useState("");

    const handleChange = (e) => {
        setComment(e?.target?.value);
    };

    const { data: userData } = useSession();
    const {
        data: dataComments,
        isLoading: isLoadingComments,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage
    } = useInfiniteQuery(
        ["comments"],
        ({ pageParam }) => {
            return getComments({ cursor: pageParam });
        },
        {
            getNextPageParam: (pageParams) =>
                pageParams?.nextCursor ?? undefined
        }
    );

    const queryClient = useQueryClient();

    const createCommentMutation = useMutation((data) => createComments(data), {
        onSuccess: () => {
            message.success("Berhasil");
            setComment("");
            queryClient.invalidateQueries("comments");
        },
        onError: (e) => {
            console.log(e);
        }
    });

    const handleSubmit = () => {
        const data = { comment, parent_id: null };
        if (!comment) {
            return;
        } else {
            createCommentMutation.mutate(data);
        }
    };

    return (
        <Skeleton loading={isLoadingComments}>
            <Comment
                avatar={userData?.user?.image}
                content={
                    <Editor
                        main={true}
                        value={comment}
                        submitting={createCommentMutation.isLoading}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                    />
                }
            />

            {dataComments?.pages?.map((page) => (
                <React.Fragment key={page?.nextCursor}>
                    <ListComments
                        user={userData}
                        data={page?.data}
                        mutation={createCommentMutation}
                        isLoading={isLoadingComments || isFetchingNextPage}
                    />
                </React.Fragment>
            ))}
            {hasNextPage && (
                <div>
                    <Button onClick={() => fetchNextPage()}>next</Button>
                </div>
            )}
        </Skeleton>
    );
};

export default UserComments;
