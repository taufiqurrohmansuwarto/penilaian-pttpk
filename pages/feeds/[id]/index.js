import { BackTop, Breadcrumb, Card, Col, Empty, Row, Skeleton } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { detailComment } from "../../../services/main.services";
import Layout from "../../../src/components/Layout";
import PageContainer from "../../../src/components/PageContainer";
import MCommentDetail from "../../../src/components/semantic/MCommentDetail";
import MListLoading from "../../../src/components/semantic/MListLoading";

function DetailFeed() {
    const router = useRouter();
    const { data: user } = useSession();
    const { data, isLoading } = useQuery(
        ["comments", "detail", router?.query?.id],
        () => detailComment(router?.query?.id),
        {
            enabled: !!router?.query?.id
        }
    );

    return (
        <PageContainer
            title="Detail"
            subTitle="Postingan"
            fixedHeader
            onBack={() => {
                router.back();
                history.scrollRestoration = "manual";
            }}
            style={{ minHeight: "90vh" }}
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
            <Row>
                <Col lg={{ span: 12, offset: 6 }}>
                    <Card>
                        <MListLoading loading={isLoading}>
                            {data?.children ? (
                                <>
                                    <MCommentDetail
                                        subComment={data?.children}
                                        comment={data?.comment}
                                        date={data?.created_at}
                                        id={data?.id}
                                        totalLikes={
                                            data?._count?.comments_likes
                                        }
                                        isLike={!!data?.comments_likes?.length}
                                        image={data?.user?.image}
                                        userId={data?.user?.custom_id}
                                        user={data?.user}
                                        username={data?.user?.username}
                                        hasAction={
                                            user?.user?.id ===
                                            data?.user?.custom_id
                                        }
                                    />
                                    <BackTop />
                                </>
                            ) : (
                                <Empty description="Ooops sepertinya komentar sudah dihapus" />
                            )}
                        </MListLoading>
                    </Card>
                </Col>
            </Row>
        </PageContainer>
    );
}

DetailFeed.Auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["MASTER", "PTTPK"]
};

DetailFeed.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default DetailFeed;
