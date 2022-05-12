import { Skeleton } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { readMail } from "../../../services/main.services";

function Detail() {
    const router = useRouter();

    const { data, isLoading } = useQuery(
        ["email", router?.query?.id],
        () => readMail(router?.query?.id),
        {
            enabled: !!router?.query?.id
        }
    );

    useEffect(() => {}, [router?.query?.id]);

    return (
        <Skeleton loading={isLoading}>
            <div>{JSON.stringify(data)}</div>
        </Skeleton>
    );
}

export default Detail;
