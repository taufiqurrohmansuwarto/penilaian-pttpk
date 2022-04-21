import moment from "moment";
import { Button, Card, DatePicker, Divider, message } from "antd";
import React, { useEffect, useState } from "react";
import FasilitatorLayout from "../../src/components/FasilitatorLayout";
import { useRouter } from "next/router";
import {
    downloadPenilaianAkhir,
    downloadPenilaianBulanan
} from "../../services/fasilitator.service";
import FileSaver from "file-saver";

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
function PenilaianTahunan({ data }) {
    const router = useRouter();

    const [tahun, setTahun] = useState(moment(data?.tahun));
    const [loading, setLoading] = useState(false);

    useEffect(() => {}, [tahun]);

    const handleChange = (e) => {
        const currentTahun = moment(e).format("YYYY");
        setTahun(e);

        router?.push(
            {
                query: {
                    tahun: currentTahun
                }
            },
            undefined,
            {
                shallow: true
            }
        );
    };

    const handleDownload = async () => {
        const currentTahun =
            router?.query?.tahun || moment(new Date()).format("YYYY");

        setLoading(true);
        try {
            const result = await downloadPenilaianAkhir({
                tahun: currentTahun
            });
            await FileSaver.saveAs(result, "hasil.xlsx");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <FasilitatorLayout title="Penilaian Akhir/Tahunan">
            <Card>
                <DatePicker.YearPicker
                    defaultValue={tahun}
                    onChange={handleChange}
                    allowClear={false}
                />
                <Divider />
                <Button
                    loading={loading}
                    type="primary"
                    onClick={handleDownload}
                >
                    Download
                </Button>
            </Card>
        </FasilitatorLayout>
    );
}

PenilaianTahunan.Auth = {
    roles: ["FASILITATOR"],
    groups: ["PTTPK"]
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
