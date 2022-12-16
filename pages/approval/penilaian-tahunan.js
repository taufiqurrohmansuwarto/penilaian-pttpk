import {
    Alert,
    Avatar,
    Button,
    Card,
    Collapse,
    DatePicker,
    Divider,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Skeleton,
    Space,
    Table,
    Tag,
    Typography
} from "antd";
import { round } from "lodash";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
    approvePenilaianAkhir,
    getPenilaianAkhir,
    getPenilaianAkhirDetail,
    riwayatPenilaianByNIPTT
} from "../../services/approval.service";
import ApprovalLayout from "../../src/components/ApprovalLayout";
import DataRealisasiPekerjaanAkhir from "../../src/components/DataRealisasiPekerjaanAkhir";
import PageContainer from "../../src/components/PageContainer";
import RiwayatPenilaianByNIPTT from "../../src/components/RiwayatPenilaianByNIPTT";

const DetailPenilaianAkhir = ({ visible, onCancel, row, tahun }) => {
    const { data: dataPenilaianAkhir, isLoading: loadingPenilaianAkhir } =
        useQuery(["detail-penilaian-akhir", row?.id, tahun], () =>
            getPenilaianAkhirDetail({ id: row?.user_custom_id, tahun })
        );

    const {
        data: dataRiwayatPenilaianByNiptt,
        isLoading: loadingDataRiwayatPenilaian
    } = useQuery(["riwayat-penilaian", row?.id], () =>
        riwayatPenilaianByNIPTT(row?.user_custom_id)
    );

    const totalAkhir = (data) => {
        const presentaseCapaianAkhir = round(
            data?.nilai?.totalPenilaianPekerjaan,
            2
        );

        const nilaiTugasTambahan = round(data?.nilai?.totalKegiatanTambahan, 2);

        return presentaseCapaianAkhir + nilaiTugasTambahan;
    };

    return (
        <Modal
            visible={visible}
            title="Detail Penilaian Akhir"
            centered
            footer={null}
            width={1200}
            onCancel={onCancel}
        >
            <Skeleton
                loading={loadingDataRiwayatPenilaian || loadingPenilaianAkhir}
            >
                <Collapse>
                    <Collapse.Panel header="Riwayat Penilaian PTT" showArrow>
                        <RiwayatPenilaianByNIPTT
                            data={dataRiwayatPenilaianByNiptt}
                        />
                    </Collapse.Panel>

                    <Collapse.Panel
                        header={`Total Nilai Realisasi Akhir dan Tugas Tambahan =  ${totalAkhir(
                            dataPenilaianAkhir
                        )}`}
                    >
                        <DataRealisasiPekerjaanAkhir
                            data={dataPenilaianAkhir}
                        />
                    </Collapse.Panel>
                </Collapse>
            </Skeleton>
        </Modal>
    );
};

const FormUpdatePenilaian = ({ visible, onCancel, row, tahun }) => {
    const { data: dataPenilaianAkhir, isLoading: loadingPenilaianAkhir } =
        useQuery(["detail-penilaian-akhir", row?.id, tahun], () =>
            getPenilaianAkhirDetail({ id: row?.user_custom_id, tahun })
        );

    const {
        data: dataRiwayatPenilaianByNiptt,
        isLoading: loadingDataRiwayatPenilaian
    } = useQuery(["riwayat-penilaian", row?.id], () =>
        riwayatPenilaianByNIPTT(row?.user_custom_id)
    );

    const totalAkhir = (data) => {
        const presentaseCapaianAkhir = round(
            data?.nilai?.totalPenilaianPekerjaan,
            2
        );

        const nilaiTugasTambahan = round(data?.nilai?.totalKegiatanTambahan, 2);

        return presentaseCapaianAkhir + nilaiTugasTambahan;
    };

    const [form] = Form.useForm();
    const nilaiIntegritas = Form.useWatch("integritas", form);
    const nilaiKedisiplinan = Form.useWatch("kedisiplinan", form);
    const nilaiOrientasiPelayanan = Form.useWatch("orientasi_pelayanan", form);
    const nilaiKerjasamaKoordinasi = Form.useWatch(
        "kerjasama_koordinasi",
        form
    );
    const nilaiPemanfaatanAlatDanMediaKerja = Form.useWatch(
        "pemanfaatan_alat_dan_media_kerja",
        form
    );

    const totalNilaiAspekPekerjaan =
        nilaiIntegritas * 0.25 +
        nilaiKedisiplinan * 0.25 +
        nilaiOrientasiPelayanan * 0.2 +
        nilaiKerjasamaKoordinasi * 0.2 +
        nilaiPemanfaatanAlatDanMediaKerja * 0.1;

    useEffect(() => {
        form.setFieldsValue({
            integritas: row?.integritas,
            kedisiplinan: row?.kedisiplinan,
            orientasi_pelayanan: row?.orientasi_pelayanan,
            kerjasama_koordinasi: row?.kerjasama_koordinasi,
            pemanfaatan_alat_dan_media_kerja:
                row?.pemanfaatan_alat_dan_media_kerja,
            catatan: row?.catatan
        });
    }, [row]);

    const queryClient = useQueryClient();

    const approveMutation = useMutation((data) => approvePenilaianAkhir(data), {
        onSuccess: () => {
            queryClient.invalidateQueries(["data-penilaian-akhir"]);
            message.success("Berhasil di approve");
            onCancel();
        }
    });

    const handleSubmit = async () => {
        const result = await form.validateFields();
        const data = { tahun, id_ptt: row?.user_custom_id, data: result };
        approveMutation.mutate(data);
    };

    return (
        <Modal
            okText="Submit"
            visible={visible}
            title="Aspek Teknis Pekerjaan"
            centered
            // footer={row?.status === "diverif" ? false : true}
            width={1200}
            onOk={handleSubmit}
            confirmLoading={approveMutation.isLoading}
            onCancel={onCancel}
        >
            <>
                {row?.status === "diverif" ? (
                    <Alert
                        style={{ marginBottom: 10 }}
                        description="Status PTTPK sudah diverifi dan dinilai. Jika anda ingin mengubah nilai yang sudah diverifikasi, silahkan hubungi pegawai yang bersangkutan untuk melakukan batal kirim penilaian"
                        message="Perhatian"
                        type="warning"
                        showIcon
                    />
                ) : null}
            </>

            <Skeleton
                loading={loadingDataRiwayatPenilaian || loadingPenilaianAkhir}
            >
                <Collapse>
                    <Collapse.Panel header="Riwayat Penilaian PTT" showArrow>
                        <RiwayatPenilaianByNIPTT
                            data={dataRiwayatPenilaianByNiptt}
                        />
                    </Collapse.Panel>

                    <Collapse.Panel
                        header={`Total Nilai Realisasi Akhir dan Tugas Tambahan =  ${totalAkhir(
                            dataPenilaianAkhir
                        )}`}
                    >
                        <DataRealisasiPekerjaanAkhir
                            data={dataPenilaianAkhir}
                        />
                    </Collapse.Panel>
                </Collapse>

                <Divider>Form Aspek Teknis Pekerjaan</Divider>
                <Form form={form} layout="vertical">
                    <Form.Item
                        help="Bobot penilaian 25%"
                        name="integritas"
                        label="Integritas"
                    >
                        <InputNumber
                            readOnly={row?.status === "diverif"}
                            min={0}
                            max={100}
                        />
                    </Form.Item>
                    <Form.Item
                        help="Bobot penilaian 25%"
                        name="kedisiplinan"
                        label="Kedisiplinan"
                    >
                        <InputNumber
                            min={0}
                            max={100}
                            readOnly={row?.status === "diverif"}
                        />
                    </Form.Item>
                    <Form.Item
                        help="Bobot penilaian 20%"
                        name="orientasi_pelayanan"
                        label="Orientasi Pelayanan"
                    >
                        <InputNumber
                            readOnly={row?.status === "diverif"}
                            min={0}
                            max={100}
                        />
                    </Form.Item>
                    <Form.Item
                        help="Bobot penilaian 20%"
                        name="kerjasama_koordinasi"
                        label="Kerjasama Koordinasi"
                    >
                        <InputNumber
                            readOnly={row?.status === "diverif"}
                            min={0}
                            max={100}
                        />
                    </Form.Item>
                    <Form.Item
                        name="pemanfaatan_alat_dan_media_kerja"
                        label="Pemanfaatan Alat dan Media Kerja"
                        help="Bobot penilaian 10%"
                    >
                        <InputNumber
                            readOnly={row?.status === "diverif"}
                            min={0}
                            max={100}
                        />
                    </Form.Item>
                    <Form.Item name="catatan" label="Catatan">
                        <Input.TextArea readOnly={row?.status === "diverif"} />
                    </Form.Item>
                </Form>
                <div>
                    <Typography.Title level={5}>
                        Total Nilai Aspek Teknis Pekerjaan ={" "}
                        {totalNilaiAspekPekerjaan}
                    </Typography.Title>
                    <Typography.Title level={5}>
                        Total Nilai Capaian Kinerja ={" "}
                        {totalAkhir(dataPenilaianAkhir)}
                    </Typography.Title>
                    {totalNilaiAspekPekerjaan > 70 &&
                    totalAkhir(dataPenilaianAkhir) > 70 ? (
                        <div>
                            <Tag color="green">Rekomendasi Dilanjutkan</Tag>
                        </div>
                    ) : (
                        <div>
                            <Tag color="red">
                                Rekomendasi Tidak Dilanjutkan karena nilai
                                capaian kinerja dan nilai aspek teknis Pekerjaan
                                kurang dari 70
                            </Tag>
                        </div>
                    )}
                </div>
            </Skeleton>
        </Modal>
    );
};

const TablePenilaianAkhir = ({ data, tahun }) => {
    const [visible, setVisible] = useState(false);
    const [currentRow, setCurrentRow] = useState();

    const handleCancel = () => setVisible(false);

    const handleDetail = (row) => {
        setVisible(true);
        setCurrentRow(row);
    };

    const columns = [
        {
            key: "no",
            title: "No.",
            render: (_, row, index) => <div>{index + 1}</div>
        },
        {
            key: "foto",
            title: "Foto",
            render: (_, row) => (
                <Avatar src={row?.pegawai?.image} size="large" shape="square" />
            )
        },
        {
            key: "nama",
            title: "Nama",
            render: (_, row) => <div>{row?.pegawai?.username}</div>
        },
        {
            key: "niptt",
            title: "NIPTT",
            render: (_, row) => <div>{row?.pegawai?.employee_number}</div>
        },
        {
            key: "status",
            title: "STATUS",
            render: (_, row) => <div>{row?.status?.toUpperCase()}</div>
        },
        {
            key: "aksi",
            title: "AKSI",
            render: (_, row) => (
                <Space>
                    <Button
                        onClick={() => handleDetail(row)}
                        type="dashed"
                        danger
                    >
                        Nilai Aspek Teknis Pekerjaan
                    </Button>
                </Space>
            )
        }
    ];

    return (
        <>
            <Table
                size="small"
                dataSource={data}
                columns={columns}
                pagination={false}
                rowKey={(row) => row?.id}
            />
            <FormUpdatePenilaian
                visible={visible}
                onCancel={handleCancel}
                row={currentRow}
                tahun={tahun}
            />
        </>
    );
};

function PenilaianTahunan({ data }) {
    const router = useRouter();
    const [date, setDate] = useState(moment(data?.tahun));

    const { data: dataPenilaianUser, isLoading } = useQuery(
        ["data-penilaian-akhir", date],
        () => getPenilaianAkhir(moment(date).format("YYYY")),
        { enabled: Boolean(date) }
    );

    const handleChange = (e) => {
        const date = moment(e).format("YYYY");
        setDate(e);
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
        <PageContainer
            title="Daftar Penilaian Tahunan"
            style={{ minHeight: "95vh" }}
            subTitle="PTTPK"
            content={
                <Alert
                    type="info"
                    message="Perhatian"
                    showIcon
                    description="Jika PTTPK dirasa sudah memilih anda sebagai atasan langsung akan tetapi tidak muncul, pastikan PTTPK yang bersangkutan mengaktifkan penilaiannya. Anda bisa memilih berdasarkan tahun dengan memilih Pilihan tanggal dibawah ini."
                />
            }
        >
            <Card>
                <DatePicker.YearPicker
                    onChange={handleChange}
                    allowClear={false}
                    defaultValue={date}
                />
                <Divider />
                <Skeleton loading={isLoading}>
                    <TablePenilaianAkhir
                        data={dataPenilaianUser}
                        tahun={moment(date).format("YYYY")}
                    />
                </Skeleton>
            </Card>
        </PageContainer>
    );
}

PenilaianTahunan.Auth = {
    roles: ["USER"],
    groups: ["MASTER"]
};

PenilaianTahunan.getLayout = function getLayout(page) {
    return <ApprovalLayout>{page}</ApprovalLayout>;
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
