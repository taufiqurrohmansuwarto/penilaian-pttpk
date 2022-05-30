import { Alert } from "@mantine/core";
import { Button, Card, DatePicker, Divider } from "antd";
import FileSaver from "file-saver";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ExclamationMark } from "tabler-icons-react";
import { downloadPenilaianAkhir } from "../../services/fasilitator.service";
import FasilitatorLayout from "../../src/components/FasilitatorLayout";
import PageContainer from "../../src/components/PageContainer";

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
        <PageContainer title="Rekap Penilaian PTT-PK" subTitle="Tahunan">
            <Card>
                <Alert
                    color="yellow"
                    my="md"
                    title="Perhatian"
                    icon={<ExclamationMark />}
                >
                    Untuk melihat rekap penilaian tahunan, silahkan terlebih
                    dahulu pilih tahun sesuai keinginan anda. Hasil dari
                    download data adalah file excel
                </Alert>

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
        </PageContainer>
    );
}

PenilaianTahunan.Auth = {
    roles: ["FASILITATOR", "ADMIN"],
    groups: ["PTTPK"]
};

PenilaianTahunan.getLayout = function getLayout(page) {
    return <FasilitatorLayout splitMenus={true}>{page}</FasilitatorLayout>;
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
