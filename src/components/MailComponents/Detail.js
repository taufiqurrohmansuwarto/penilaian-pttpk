import { Button } from "@mantine/core";
import { Skeleton } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { readMail } from "../../../services/main.services";

function Detail({ type = "inbox" }) {
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
            <div></div>
            <div>{data?.body}</div>

            <Button>Balas</Button>
        </Skeleton>
    );
}

export default Detail;
