import { Skeleton } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { readMail } from "../../../services/main.services";
import moment from "moment";

function Detail({ inbox = false }) {
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
            <div>Pesan: </div>
            {moment(data?.date).format("lll")}
            <div dangerouslySetInnerHTML={{ __html: data?.body }} />
        </Skeleton>
    );
}

export default Detail;
