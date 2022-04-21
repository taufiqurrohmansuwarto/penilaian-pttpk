import ApprovalLayout from "../../src/components/ApprovalLayout";
import moment from "moment";
import {
    Avatar,
    Button,
    Card,
    DatePicker,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Skeleton,
    Space,
    Table
} from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
    approvePenilaianAkhir,
    getPenilaianAkhir
} from "../../services/approval.service";

//

const FormUpdatePenilaian = ({ visible, onCancel, row, tahun }) => {
    const [form] = Form.useForm();

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
        }
    });

    const handleSubmit = async () => {
        try {
            const result = await form.validateFields();
            const data = { tahun, id_ptt: row?.user_custom_id, data: result };
            approveMutation.mutate(data);
        } catch (error) {}
    };

    return (
        <Modal
            okText="Beri Nilai dan Verif"
            visible={visible}
            title="Detail Penilaian Akhir"
            onOk={handleSubmit}
            confirmLoading={approveMutation.isLoading}
            onCancel={onCancel}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="integritas" label="Integritas">
                    <InputNumber />
                </Form.Item>
                <Form.Item name="kedisiplinan" label="Kedisiplinan">
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    name="orientasi_pelayanan"
                    label="Orientasi Pelayanan"
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    name="kerjasama_koordinasi"
                    label="Kerjasama Koordinasi"
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    name="pemanfaatan_alat_dan_media_kerja"
                    label="Pemanfaatan Alat dan Media Kerja"
                >
                    <InputNumber />
                </Form.Item>
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
                    <Button onClick={() => handleDetail(row)}>Lihat</Button>
                </Space>
            )
        }
    ];

    return (
        <>
            <Table
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
        <ApprovalLayout title="Daftar Pengajuan Penilaian Tahunan/Akhir">
            <Card>
                <DatePicker.YearPicker
                    onChange={handleChange}
                    allowClear={false}
                    defaultValue={date}
                />
                <Skeleton loading={isLoading}>
                    <TablePenilaianAkhir
                        data={dataPenilaianUser}
                        tahun={moment(date).format("YYYY")}
                    />
                </Skeleton>
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
