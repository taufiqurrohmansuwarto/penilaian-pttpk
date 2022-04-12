import { Row, Col, Card } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { getCommentsByPost } from "../../../services/main.services";
import Layout from "../../../src/components/Layout";
import CardCommunitiesDescription from "../../../src/components/reddits/Cards/CardCommunitiesDescription";
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

    return (
        <Layout>
            <Row gutter={[16, 16]}>
                <Col span={4}></Col>
                <Col span={15}>
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
