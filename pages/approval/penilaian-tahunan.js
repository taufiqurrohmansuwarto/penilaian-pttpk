import ApprovalLayout from "../../src/components/ApprovalLayout";
import moment from "moment";
import { Card, DatePicker } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
function PenilaianTahunan({ data }) {
    const router = useRouter();
    const [date, setDate] = useState(moment(data?.tahun));

    useEffect(() => {}, [date]);

    const handleChange = (e) => {
        const date = moment(e).format("YYYY");
        router.push(
            {
                query: {
                    tahun: date
                }
            },
            undefined,
            { scroll: false }
        );
    };

    return (
        <ApprovalLayout title="Daftar Pengajuan Penilaian Tahunan/Akhir">
            <Card>
                <DatePicker.YearPicker
                    onChange={handleChange}
                    allowClear={false}
                    defaultValue={date}
                />
            </Card>
        </ApprovalLayout>
    );
}

PenilaianTahunan.Auth = {
    roles: ["USER"],
    groups: ["MASTER"]
};

export const getServerSideProps = async (ctx) => {
    const tahun = ctx?.query?.tahun || moment(new Date()).format("YYYY");
    return {
        props: {
            data: {
                tahun
            }
        }
    };
};

export default PenilaianTahunan;
