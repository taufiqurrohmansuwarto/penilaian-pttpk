import { useScrollIntoView } from "@mantine/hooks";
import { Breadcrumb, Card, Col, Row, Skeleton } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import {
    getCommentsByPost,
    getPostById
} from "../../../services/main.services";
import Layout from "../../../src/components/Layout";
import PageContainer from "../../../src/components/PageContainer";
import CardPostNew from "../../../src/components/reddits/Cards/CardPostNew";
import CreateComments from "../../../src/components/reddits/CreateComments";
import SubscribePost from "../../../src/components/SubscribePost";

function Comments({ data: { target } }) {
    const router = useRouter();
    const { data: user, status } = useSession();

    const { data: dataComments, isLoading } = useQuery(
        ["comments", router?.query?.id],
        () => getCommentsByPost(router?.query?.id),
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

    const { targetRef, scrollIntoView } = useScrollIntoView({ offset: 100 });

    useEffect(() => {
        scrollIntoView();
    }, [isLoading, dataComments]);

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
                        {JSON.stringify(target)}
                        <Skeleton
                            avatar
                            loading={isLoadingPost || status === "loading"}
                        >
                            <CardPostNew user={user} data={dataPost} />
                        </Skeleton>
                        <CreateComments
                            data={dataComments}
                            id={router?.query?.id}
                            target={target}
                            targetRef={targetRef}
                        />
                    </Col>
                    <Col span={6}>
                        <SubscribePost data={dataPost} id={router?.query?.id} />
                    </Col>
                </Row>
            </PageContainer>
        </Layout>
    );
}
export const getServerSideProps = async (ctx) => {
    const target = ctx?.query?.target;
    return {
        props: {
            data: { target }
        }
    };
};

Comments.auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["MASTER", "PTTPK"]
};

export default Comments;
