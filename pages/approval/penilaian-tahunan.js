import ApprovalLayout from "../../src/components/ApprovalLayout";
import moment from "moment";
import {
    Alert,
    Avatar,
    Button,
    Card,
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
    Typography
} from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
    approvePenilaianAkhir,
    getPenilaianAkhir
} from "../../services/approval.service";
import PageContainer from "../../src/components/PageContainer";
import DataRealisasiPekerjaanAkhir from "../../src/components/DataRealisasiPekerjaanAkhir";
import RiwayatPenilaianByNIPTT from "../../src/components/RiwayatPenilaianByNIPTT";

const DetailPenilaianAkhir = ({ visible, onCancel, row, tahun }) => {
    return (
        <Modal
            visible={visible}
            title="Detail Penilaian Akhir"
            centered
            footer={null}
            width={1200}
            onCancel={onCancel}
        >
            <RiwayatPenilaianByNIPTT id={row?.user_custom_id} />
            <DataRealisasiPekerjaanAkhir
                id={row?.user_custom_id}
                tahun={tahun}
            />
        </Modal>
    );
};

const FormUpdatePenilaian = ({ visible, onCancel, row, tahun }) => {
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
            okText="Beri Nilai dan Verif"
            visible={visible}
            title="Penilaian Akhir"
            centered
            footer={row?.status === "diverif" ? false : true}
            width={1200}
            onOk={handleSubmit}
            confirmLoading={approveMutation.isLoading}
            onCancel={onCancel}
        >
            <>
                {row?.status === "diverif" ? (
                    <Alert
                        style={{ marginBottom: 10 }}
                        description="Jika anda ingin mengubah nilai yang sudah diverifikasi, silahkan hubungi pegawai yang bersangkutan harus melakukan batal kirim penilaian"
                        message="Perhatian"
                        type="warning"
                        showIcon
                    />
                ) : (
                    <Alert />
                )}
            </>
            <Form form={form} layout="vertical">
                <Form.Item
                    help="Bobot penilaian 25%"
                    name="integritas"
                    label="Integritas"
                >
                    <InputNumber min={0} max={100} />
                </Form.Item>
                <Form.Item
                    help="Bobot penilaian 25%"
                    name="kedisiplinan"
                    label="Kedisiplinan"
                >
                    <InputNumber min={0} max={100} />
                </Form.Item>
                <Form.Item
                    help="Bobot penilaian 20%"
                    name="orientasi_pelayanan"
                    label="Orientasi Pelayanan"
                >
                    <InputNumber min={0} max={100} />
                </Form.Item>
                <Form.Item
                    help="Bobot penilaian 20%"
                    name="kerjasama_koordinasi"
                    label="Kerjasama Koordinasi"
                >
                    <InputNumber min={0} max={100} />
                </Form.Item>
                <Form.Item
                    name="pemanfaatan_alat_dan_media_kerja"
                    label="Pemanfaatan Alat dan Media Kerja"
                    help="Bobot penilaian 10%"
                >
                    <InputNumber min={0} max={100} />
                </Form.Item>
                <Divider>Catatan Penilaian Akhir</Divider>
                <Form.Item name="catatan" label="Catatan">
                    <Input.TextArea />
                </Form.Item>
            </Form>
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

    const [visibleDetail, setVisibleDetail] = useState(false);
    const [currentRowDetail, setCurrentRowDetail] = useState();

    const handleCancelDetail = () => setVisibleDetail(false);

    const handleDetailDetail = (row) => {
        setVisibleDetail(true);
        setCurrentRowDetail(row);
    };

    const columns = [
        {
            key: "foto",
            title: "Foto",
            render: (_, row) => (
                <div>
                    <Avatar src={row?.pegawai?.image} />
                </div>
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
            title: "Status",
            render: (_, row) => <div>{row?.status?.toUpperCase()}</div>
        },
        {
            key: "aksi",
            title: "Aksi",
            render: (_, row) => (
                <Space>
                    <Button
                        onClick={() => handleDetail(row)}
                        type="dashed"
                        danger
                    >
                        Nilai
                    </Button>
                    <Button onClick={() => handleDetailDetail(row)}>
                        Detail
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
            <DetailPenilaianAkhir
                visible={visibleDetail}
                onCancel={handleCancelDetail}
                row={currentRowDetail}
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
