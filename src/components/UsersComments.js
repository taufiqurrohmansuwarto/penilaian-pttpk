import {
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
import React, { useState } from "react";
import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient
} from "react-query";
import { createComments, getComments } from "../../services/main.services";

moment.locale("id");

const { TextArea } = Input;

const Editor = ({ main, onChange, onSubmit, submitting, value, onCancel }) => (
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
                    Ayo diskusikan
                </Button>
                {!main && <Button onClick={onCancel}>Cancel</Button>}
            </Space>
        </Form.Item>
    </div>
);

const ListComments = ({ data, isLoading }) => {
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
                                    <span>Balas</span>,
                                    <span>test</span>
                                ]}
                                content={item?.comment}
                                datetime={moment(item?.created_at).fromNow()}
                                author={item?.nama}
                                avatar={item?.avatar}
                            >
                                <Comment content={"test"} />
                            </Comment>
                        </li>
                    )}
                />
            ) : null}
        </div>
    );
};

const UserComments = () => {
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
            console.log(pageParam);
            return getComments({ cursor: pageParam });
        },
        {
            //     getPreviousPageParam: (e) => console.log("previous", e),
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
            console.log(data);
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
                        data={page?.data}
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
