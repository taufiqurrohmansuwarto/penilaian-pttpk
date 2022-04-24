import moment from "moment";
import {
    Avatar,
    Breadcrumb,
    Button,
    Col,
    Comment,
    Form,
    List,
    Popconfirm,
    Row,
    Skeleton,
    Space
} from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
    createComments,
    detailComment,
    dislikes,
    likes,
    removeComment,
    updateComment,
    uploads
} from "../../../services/main.services";
import Layout from "../../../src/components/Layout";
import PageContainer from "../../../src/components/PageContainer";
import RichTextEditor from "../../../src/components/RichTextEditor";
import Link from "next/link";

const Editor = ({
    main,
    onChange,
    onSubmit,
    submitting,
    value,
    onCancel,
    buttonText = "Kirim",
    placeholder = "Apa yang ingin anda sampaikan?"
}) => {
    const upload = async (file) => {
        try {
            const formData = new FormData();
            formData.append("image", file);
            const result = await uploads(formData);
            return result;
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <Form.Item>
                <RichTextEditor
                    onImageUpload={upload}
                    style={{ minHeight: 180 }}
                    labels={placeholder}
                    radius="md"
                    onChange={onChange}
                    controls={[
                        [
                            "bold",
                            "italic",
                            "underline",
                            "link",
                            "orderedList",
                            "unorderedList"
                        ],
                        ["alignCenter", "alignLeft", "alignRight"]
                    ]}
                    value={value}
                />
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
                    {!main && <Button onClick={onCancel}>Batal</Button>}
                </Space>
            </Form.Item>
        </div>
    );
};

const ChildrenComponent = ({ data, handleRemove, handleUpdate, user }) => {
    const [editId, setEditId] = useState();
    const [comment, setComment] = useState();

    const onCancel = () => {
        setEditId(null);
    };

    return (
        <div>
            {data?.length > 0 ? (
                <List
                    itemLayout="horizontal"
                    header={`${data?.length} balasan`}
                    dataSource={data}
                    rowKey={(row) => row?.id}
                    renderItem={(item) => {
                        return (
                            <li>
                                <Comment
                                    avatar={
                                        <Avatar
                                            shape="square"
                                            src={item?.user?.image}
                                        />
                                    }
                                    actions={[
                                        <>
                                            {user?.user?.id ===
                                                item?.user_custom_id && (
                                                <span
                                                    onClick={() => {
                                                        setEditId(item?.id);
                                                        setComment(
                                                            item?.comment
                                                        );
                                                    }}
                                                >
                                                    Edit
                                                </span>
                                            )}
                                        </>,

                                        <>
                                            {user?.user?.id ===
                                                item?.user_custom_id && (
                                                <Popconfirm
                                                    title="Apakah anda yakin ingin menghapus"
                                                    onConfirm={() =>
                                                        handleRemove(item?.id)
                                                    }
                                                >
                                                    <span>Hapus</span>
                                                </Popconfirm>
                                            )}
                                        </>
                                    ]}
                                    author={item?.user?.username}
                                    content={
                                        <>
                                            {item?.id === editId ? (
                                                <Editor
                                                    onCancel={onCancel}
                                                    value={comment}
                                                    onChange={setComment}
                                                    onSubmit={async () => {
                                                        await handleUpdate({
                                                            id: item?.id,
                                                            comment: comment
                                                        });
                                                        setEditId(null);
                                                    }}
                                                    buttonText="Edit"
                                                />
                                            ) : (
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: item?.comment
                                                    }}
                                                />
                                            )}
                                        </>
                                    }
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

function DetailFeed() {
    const router = useRouter();
    const { data, isLoading } = useQuery(
        ["detail-comment", router?.query?.id],
        () => detailComment(router?.query?.id),
        {
            enabled: !!router?.query?.id
        }
    );

    const [comment, setComment] = useState();

    const queryClient = useQueryClient();

    const createCommentMutation = useMutation((data) => createComments(data), {
        onSuccess: () => {
            message.success("Berhasil");
            setComment("");
            queryClient.invalidateQueries("detail-comment");
        },
        onError: (e) => {
            console.log(e);
        }
    });

    const likeMutation = useMutation((data) => likes(data), {
        onSuccess: () => queryClient.invalidateQueries("detail-comment")
    });
    const dislikeMutation = useMutation((data) => dislikes(data), {
        onSuccess: () => queryClient.invalidateQueries("detail-comment")
    });

    const removeMutation = useMutation((data) => removeComment(data), {
        onSuccess: () => queryClient.invalidateQueries("detail-comment")
    });

    const updateMutation = useMutation((data) => updateComment(data), {
        onSuccess: () => queryClient.invalidateQueries("detail-comment")
    });

    const handleLike = (data) => likeMutation.mutate(data);
    const handleDislike = (data) => dislikeMutation.mutate(data);
    const handleRemove = (data) => removeMutation.mutate(data);
    const handleUpdate = async (data) => {
        updateMutation.mutateAsync(data);
    };

    const { data: dataUser, status } = useSession();

    return (
        <Layout>
            <PageContainer
                title="Detail"
                subTitle="Postingan"
                breadcrumbRender={() => (
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link href="/feeds">
                                <a>Feedback</a>
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Detail</Breadcrumb.Item>
                    </Breadcrumb>
                )}
            >
                <Skeleton loading={isLoading || status === "loading"}>
                    <Row>
                        <Col span={10} offset={6}>
                            <Comment
                                avatar={
                                    <Avatar
                                        src={data?.user?.image}
                                        shape="square"
                                    />
                                }
                                author={data?.user?.username}
                                datetime={moment(data?.created_at).fromNow()}
                                content={
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: data?.comment
                                        }}
                                    />
                                }
                            >
                                <ChildrenComponent
                                    data={data?.children}
                                    user={dataUser}
                                />
                            </Comment>
                        </Col>
                    </Row>
                </Skeleton>
            </PageContainer>
        </Layout>
    );
}

DetailFeed.Auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["MASTER", "PTTPK"]
};

export default DetailFeed;
