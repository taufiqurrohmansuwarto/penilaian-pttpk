import { Card, Col, Divider, Row, Skeleton } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";
import {
    findCommunities,
    getPostsByCommunities
} from "../../../services/main.services";
import Posts from "./Cards/Posts";

function Communities() {
    const router = useRouter();

    const { data, isLoading } = useQuery(
        ["communities", router?.query?.sub],
        () => findCommunities(router?.query?.sub),
        {
            enabled: !!router?.query?.sub
        }
    );

    const {
        data: dataPostByCommunities,
        isLoading: loadingDataPostByCommunities
    } = useQuery(
        ["posts", router?.query?.sub],
        () => getPostsByCommunities(router?.query?.sub),
        {
            enabled: !!router?.query?.sub
        }
    );

    useEffect(() => {
        if (!router.isReady) {
            return null;
        }
    }, [router?.query?.sub]);

    return (
        <div>
            <Skeleton loading={isLoading || loadingDataPostByCommunities}>
                <Row gutter={32}>
                    <Col span={7}></Col>
                    <Col span={10}>
                        <Posts posts={dataPostByCommunities} />
                    </Col>
                    <Col span={7}>
                        <Card>{JSON.stringify(data)}</Card>
                    </Col>
                </Row>
                <Divider />
            </Skeleton>
        </div>
    );
}

export default Communities;
