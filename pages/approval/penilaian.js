import { Card, DatePicker, Skeleton } from "antd";
import { isEmpty } from "lodash";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getPenilaianApproval } from "../../services/approval.service";
import ApprovalLayout from "../../src/components/ApprovalLayout";

// hehe patut di contoh
function Penilaian() {
    const {
        data: dataPenilaianApproval,
        isLoading: loadingDataPenilaianApproval
    } = useQuery(
        ["approval_penilaian_bulanan", date],
        () =>
            getPenilaianApproval({
                bulan: moment(date).format("M"),
                tahun: moment(date).format("YYYY")
            }),
        {
            enabled: !!date
        }
    );

    const { data } = useSession();

    const router = useRouter();

    const [date, setDate] = useState(
        router?.query?.bulan && router?.query?.tahun && router?.isReady
            ? moment(new Date())
            : moment(
                  `${moment(router?.query?.tahun).format("YYYY")}-${moment(
                      router?.query?.bulan
                  ).format("M")}-01`
              )
    );

    const handleChange = (e) => {
        const bulan = moment(e).format("M");
        const tahun = moment(e).format("YYYY");
        setDate(e);
        router.push(
            {
                query: {
                    bulan,
                    tahun
                }
            },
            undefined,
            {
                scroll: false
            }
        );
    };

    useEffect(() => {
        if (router?.isReady) {
        }
    }, [date, router?.isReady]);

    return (
        <ApprovalLayout title="Daftar Penilaian">
            <Skeleton loading={!router?.isReady}>
                <Card>
                    <DatePicker.MonthPicker
                        onChange={handleChange}
                        value={date}
                    />
                    {JSON.stringify(date)}
                </Card>
            </Skeleton>
        </ApprovalLayout>
    );
}

Penilaian.Auth = {
    roles: ["USER"],
    groups: ["MASTER"]
};

export default Penilaian;
