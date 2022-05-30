import moment from "moment";
import { Button, Card, DatePicker, Divider, message } from "antd";
import React, { useEffect, useState } from "react";
import FasilitatorLayout from "../../src/components/FasilitatorLayout";
import { useRouter } from "next/router";
import { downloadPenilaianBulanan } from "../../services/fasilitator.service";
import FileSaver from "file-saver";
import PageContainer from "../../src/components/PageContainer";
import { Alert } from "@mantine/core";
import { ExclamationMark } from "tabler-icons-react";

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
function PenilaianBulanan({ data }) {
    const router = useRouter();

    const [bulan, setBulan] = useState(moment(`${data?.tahun}-${data?.bulan}`));
    const [loading, setLoading] = useState(false);

    useEffect(() => {}, [bulan]);

    const handleChange = (e) => {
        const tahun = moment(e).format("YYYY");
        const bulan = moment(e).format("M");

        router?.push(
            {
                query: {
                    bulan,
                    tahun
                }
            },
            undefined,
            {
                shallow: true
            }
        );
    };

    const handleDownload = async () => {
        const currentBulan =
            router?.query?.bulan || moment(new Date()).format("M");
        const currentTahun =
            router?.query?.tahun || moment(new Date()).format("YYYY");

        setLoading(true);
        try {
            const result = await downloadPenilaianBulanan({
                bulan: currentBulan,
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
        <PageContainer title="Rekapan Penilaian PTT-PK" subTitle="Bulanan">
            <Card>
                <Alert
                    color="yellow"
                    my="md"
                    title="Perhatian"
                    icon={<ExclamationMark />}
                >
                    Untuk melihat rekap penilaian bulanan, silahkan terlebih
                    dahulu pilih bulan sesuai keinginan anda. Hasil dari
                    download data adalah file excel,anda bisa menggunakan filter
                    excel pada kolom sudah verif untuk mengetahui pegawai yang
                    sudah mengerjakan atau belum.
                </Alert>
                <DatePicker.MonthPicker
                    defaultValue={bulan}
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

PenilaianBulanan.Auth = {
    roles: ["FASILITATOR", "ADMIN"],
    groups: ["PTTPK"]
};

PenilaianBulanan.getLayout = function getLayout(page) {
    return <FasilitatorLayout splitMenus={true}>{page}</FasilitatorLayout>;
};

export const getServerSideProps = async (ctx) => {
    const bulan = ctx?.query?.bulan || moment(new Date()).format("M");
    const tahun = ctx?.query?.tahun || moment(new Date()).format("YYYY");
    return {
        props: {
            data: {
                bulan,
                tahun
            }
        }
    };
};

export default PenilaianBulanan;
