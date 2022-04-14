import { Col, Row, Skeleton } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import {
    getCommentsByPost,
    getPostById
} from "../../../services/main.services";
import Layout from "../../../src/components/Layout";
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
            <Row gutter={[16, 16]}>
                <Col span={4}></Col>
                <Col span={15}>
                    <Skeleton avatar loading={isLoadingPost}>
                        <CardPost data={dataPost} />
                    </Skeleton>
                    <CreateComments
                        data={dataComments}
                        id={router?.query?.id}
                    />
                </Col>
                <Col span={5}>
                    <Row gutter={[8, 8]}>
                        <Col span={24}>
                            <CardCommunitiesDescription />
                        </Col>
                        <Col span={24}>
                            <CardRules />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Layout>
    );
}

Comments.auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["MASTER", "PTTPK"]
};

export default Comments;
