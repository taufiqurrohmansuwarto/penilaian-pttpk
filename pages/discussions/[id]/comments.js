import { Breadcrumb, Col, Row, Skeleton } from "antd";
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
import CardCommunitiesDescription from "../../../src/components/reddits/Cards/CardCommunitiesDescription";
import CardPost from "../../../src/components/reddits/Cards/CardPost";
import CardRules from "../../../src/components/reddits/Cards/CardRules";
import CreateComments from "../../../src/components/reddits/CreateComments";

function Comments() {
    const router = useRouter();

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
                    <Col span={13} offset={4}>
                        <Skeleton avatar loading={isLoadingPost}>
                            <CardPost data={dataPost} />
                        </Skeleton>
                        <CreateComments
                            data={dataComments}
                            id={router?.query?.id}
                        />
                    </Col>
                    <Col span={6}>
                        <Row gutter={[8, 8]}>
                            <Col span={24}>
                                <Skeleton loading={isLoadingPost}>
                                    <CardCommunitiesDescription
                                        title={dataPost?.parent?.title}
                                        description={dataPost?.parent?.content}
                                    />
                                </Skeleton>
                            </Col>
                            <Col span={24}>
                                <Skeleton loading={isLoadingPost}>
                                    <CardRules
                                        rules={dataPost?.parent?.rules}
                                    />
                                </Skeleton>
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
