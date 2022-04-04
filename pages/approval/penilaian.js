import { Card, DatePicker } from "antd";
import { useEffect, useState } from "react";
import ApprovalLayout from "../../src/components/ApprovalLayout";
import ApprovalPenilaian from "../../src/components/ApprovalPenilaian";
import moment from "moment";
import { useRouter } from "next/router";

function Penilaian() {
    const [tahun, setTahun] = useState();
    const [bulan, setBulan] = useState();
    const router = useRouter();

    const [date, setDate] = useState(moment(new Date()));

    const handleChange = (e) => {
        const bulan = moment(e).format("M");
        const tahun = moment(e).format("YYYY");
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

    useEffect(() => {}, [tahun, bulan]);

    return (
        <ApprovalLayout title="Daftar Penilaian">
            <Card>
                <DatePicker.MonthPicker onChange={handleChange} value={date} />
            </Card>
            <ApprovalPenilaian />
        </ApprovalLayout>
    );
}

Penilaian.Auth = {
    roles: ["USER"],
    groups: ["MASTER"]
};

export default Penilaian;
