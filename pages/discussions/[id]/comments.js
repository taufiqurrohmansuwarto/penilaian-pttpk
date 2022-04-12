import { Row, Col } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { getCommentsByPost } from "../../../services/main.services";
import Layout from "../../../src/components/Layout";
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
            <Row gutter={[8, 8]}>
                <Col span={4}></Col>
                <Col span={15}>
                    <CreateComments
                        data={dataComments}
                        id={router?.query?.id}
                    />
                </Col>
                <Col span={5}></Col>
            </Row>
        </Layout>
    );
}

Comments.auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["MASTER", "PTTPK"]
};

export default Comments;
