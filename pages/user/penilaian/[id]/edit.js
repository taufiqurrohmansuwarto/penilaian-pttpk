import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { getRefSatuanKinerja } from "../../../../services/ref.service";
import UserLayout from "../../../../src/components/UserLayout";
import { detailPenilaian } from "../../../../services/users.service";
import { useEffect } from "react";
import { Skeleton } from "antd";

const TargetTahunan = () => {
    const {
        query: { id }
    } = useRouter();

    useEffect(() => {}, [id]);

    const { data, isLoading } = useQuery(
        ["penilaian", id],
        () => {
            return detailPenilaian(id);
        },
        {
            enabled: !!id
        }
    );

    return (
        <UserLayout>
            <Skeleton loading={isLoading}>{JSON.stringify(data)}</Skeleton>
        </UserLayout>
    );
};

TargetTahunan.Auth = {
    roles: ["USER"],
    groups: ["PTTPK"]
};

export default TargetTahunan;
