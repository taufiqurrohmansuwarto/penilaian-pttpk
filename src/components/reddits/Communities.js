import { Divider, Skeleton } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";
import {
    findCommunities,
    getPostsByCommunities
} from "../../../services/main.services";

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
    }, router?.query?.sub);

    return (
        <div>
            <Skeleton loading={isLoading || loadingDataPostByCommunities}>
                {JSON.stringify(data)}
                <Divider />
                {JSON.stringify(dataPostByCommunities)}
            </Skeleton>
        </div>
    );
}

export default Communities;
