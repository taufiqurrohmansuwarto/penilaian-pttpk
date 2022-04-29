import { Breadcrumb, Col, Row, Skeleton } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import {
    getCommentsByPost,
    getPostById
} from "../../../services/main.services";
import Layout from "../../../src/components/Layout";
import PageContainer from "../../../src/components/PageContainer";
import ParticipantsDiscussion from "../../../src/components/ParticipantsDiscussion";
import CardPostNew from "../../../src/components/reddits/Cards/CardPostNew";
import CreateComments from "../../../src/components/reddits/CreateComments";
import SubscribePost from "../../../src/components/SubscribePost";

function Comments() {
    const router = useRouter();
    const { data: user, status } = useSession();

    const { data: dataComments, isLoading } = useQuery(
        ["comments", router?.query?.id, router?.query?.target],
        () => getCommentsByPost(router?.query?.id, router?.query?.target),
        {
            enabled: !!router?.query?.id
        }
    );

    const { data: dataPost, isLoading: isLoadingPost } = useQuery(
        ["post", router?.query?.id],
        () => getPostById(router?.query?.id),
        {
            enabled: !!router?.query?.id
        }
    );

    return (
        <Layout>
            <PageContainer
                title="Komentar"
                subTitle="Diskusi"
                fixedHeader
                breadcrumbRender={() => (
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link href="/discussions">
                                <a>Diskusi</a>
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Komentar</Breadcrumb.Item>
                    </Breadcrumb>
                )}
            >
                <Row gutter={[16, 16]}>
                    <Col span={18}>
                        <Skeleton
                            avatar
                            loading={isLoadingPost || status === "loading"}
                        >
                            <CardPostNew user={user} data={dataPost} />
                        </Skeleton>
                        <Skeleton loading={isLoading} active avatar>
                            <CreateComments
                                data={dataComments}
                                id={router?.query?.id}
                            />
                        </Skeleton>
                    </Col>
                    <Col span={6}>
                        <Row gutter={[8, 8]}>
                            <Col span={24}>
                                <SubscribePost
                                    data={dataPost}
                                    id={router?.query?.id}
                                />
                            </Col>
                            <Col span={24}>
                                {dataComments?.participants?.length ? (
                                    <ParticipantsDiscussion
                                        users={dataComments?.participants}
                                    />
                                ) : null}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </PageContainer>
        </Layout>
    );
}

Comments.auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["MASTER", "PTTPK"]
};

export default Comments;
