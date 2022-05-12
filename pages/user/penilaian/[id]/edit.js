import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import { getRefSatuanKinerja } from "../../../../services/ref.service";
import UserLayout from "../../../../src/components/UserLayout";
import {
    cariPegawaiPNS,
    detailPenilaian,
    getJabatan,
    getUnor,
    updatePenilaian
} from "../../../../services/users.service";
import { useEffect, useState } from "react";
import {
    Breadcrumb,
    Button,
    Card,
    DatePicker,
    Form,
    InputNumber,
    message,
    Select,
    Skeleton,
    Spin,
    TreeSelect
} from "antd";
import moment from "moment";
import { useDebouncedValue } from "@mantine/hooks";
import { isEmpty } from "lodash";
import PageContainer from "../../../../src/components/PageContainer";
import Link from "next/link";

const FormPegawaiPNS = ({ label, name, help }) => {
    const [nip, setNip] = useState("");
    const [debounceValue] = useDebouncedValue(nip, 500);

    const { data: dataPns, isLoading: isLoadingPNS } = useQuery(
        ["pegawai", debounceValue],
        () => cariPegawaiPNS(debounceValue),
        {
            enabled: Boolean(debounceValue),
            refetchOnWindowFocus: false
        }
    );

    return (
        <Form.Item name={name} label={label} help={help}>
            <Select
                showSearch
                labelInValue
                showArrow={false}
                filterOption={false}
                onSearch={(e) => setNip(e)}
                allowClear
                loading={isLoadingPNS}
                defaultActiveFirstOption={false}
                notFoundContent={isLoadingPNS ? <Spin size="small" /> : null}
            >
                {!isEmpty(dataPns) && (
                    <Select.Option
                        value={dataPns?.pegawai_id}
                        key={dataPns?.pegawai_id}
                    >
                        {dataPns?.nama}({dataPns?.nip}) - {dataPns?.golongan}(
                        {dataPns?.pangkat})
                    </Select.Option>
                )}
            </Select>
        </Form.Item>
    );
};

const EditFormPenilaian = ({
    form,
    data,
    dataJabatan,
    dataUnor,
    handleSubmit,
    loading
}) => {
    useEffect(() => {
        form.setFieldsValue({
            tahun: data?.tahun,
            periode: [moment(data?.awal_periode), moment(data?.akhir_periode)],
            id_jabatan: data?.id_jabatan,
            id_skpd: data?.id_skpd,
            atasan_langsung: data?.atasan_langsung,
            atasan_banding: data?.atasan_banding,
            eselon_ii: data?.eselon_ii,
            pengalaman_kerja: data?.pengalaman_kerja
        });
    }, [data]);

    return (
        <Card>
            <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                requiredMark={false}
            >
                <Form.Item
                    name="tahun"
                    label="Tahun"
                    rules={[{ required: true, message: "tidak boleh kosong" }]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    name="periode"
                    label="Periode"
                    rules={[{ required: true, message: "tidak boleh kosong" }]}
                >
                    <DatePicker.RangePicker />
                </Form.Item>
                <FormPegawaiPNS
                    name="atasan_langsung"
                    label="Penilai"
                    help="Ketik NIP untuk mencari PNS"
                    rules={[{ required: true, message: "tidak boleh kosong" }]}
                />
                <FormPegawaiPNS
                    name="atasan_banding"
                    label="Atasan Banding Eselon III"
                    help="Ketik NIP untuk mencari PNS"
                    rules={[{ required: true, message: "tidak boleh kosong" }]}
                />
                <FormPegawaiPNS
                    name="eselon_ii"
                    label="Eselon II"
                    help="Ketik NIP untuk mencari PNS"
                    rules={[{ required: true, message: "tidak boleh kosong" }]}
                />
                <Form.Item
                    name="id_jabatan"
                    label="Jabatan"
                    rules={[{ required: true, message: "tidak boleh kosong" }]}
                >
                    <Select>
                        {dataJabatan?.map((d) => (
                            <Select.Option
                                name={`${d?.nama}`}
                                values={d?.id}
                                key={d?.id}
                            >
                                {d?.nama} - ({d?.tgl_aktif})
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="id_skpd"
                    label="Unit Kerja"
                    rules={[{ required: true, message: "tidak boleh kosong" }]}
                >
                    <TreeSelect
                        // labelInValue
                        showSearch
                        treeNodeFilterProp="title"
                        treeData={dataUnor}
                    />
                </Form.Item>
                <Form.Item
                    name="pengalaman_kerja"
                    label="Pengalaman Kerja"
                    help="Dalam Tahun"
                >
                    <InputNumber min={0} max={100} />
                </Form.Item>
                <Form.Item>
                    <Button loading={loading} htmlType="submit" type="primary">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

const TargetTahunan = () => {
    const router = useRouter();
    const { id } = router?.query;

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

    const { data: dataJabatan, isLoading: isLoadingDataJabatan } = useQuery(
        ["jabatan"],
        () => getJabatan(),
        {
            refetchOnWindowFocus: false,
            retryOnMount: false,
            refetchOnMount: false
        }
    );

    const { data: dataUnor, isLoading: isLoadingUnor } = useQuery(
        ["unor"],
        () => getUnor(),
        {
            refetchOnWindowFocus: false,
            retryOnMount: false,
            refetchOnMount: false
        }
    );

    const [form] = Form.useForm();

    const updatePenilaianMutation = useMutation(
        (data) => updatePenilaian(data),
        {
            onSuccess: () => {
                message.success("Sukses update");
                router.push("/user/penilaian");
            },
            onError: (error) => {
                message.error(error);
            }
        }
    );

    const handleSubmit = (values) => {
        const {
            periode,
            id_jabatan,
            atasan_langsung,
            atasan_banding,
            eselon_ii,
            id_skpd,
            tahun,
            pengalaman_kerja
        } = values;
        const [awal, akhir] = periode;
        const awal_periode = moment(awal).toISOString();
        const akhir_periode = moment(akhir).toISOString();
        const jabatan = dataJabatan?.find(
            (jabatan) => parseInt(jabatan?.id) === parseInt(id_jabatan)
        );

        const id_atasan_langsung = `master|${atasan_langsung?.value}`;
        const id_atasan_banding = `master|${atasan_banding?.value}`;
        const id_eselon_ii = `master|${eselon_ii?.value}`;

        const data = {
            tahun,
            awal_periode,
            akhir_periode,
            id_jabatan,
            jabatan,
            atasan_langsung,
            atasan_banding,
            eselon_ii,
            id_atasan_banding,
            id_atasan_langsung,
            id_eselon_ii,
            id_skpd,
            pengalaman_kerja
        };

        const currentData = { id, data };

        updatePenilaianMutation.mutate(currentData);
    };

    return (
        <PageContainer
            title="Edit Penilaian"
            subTitle="PTTPK"
            breadcrumbRender={() => (
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link href="/user/penilaian">
                            <a>Penilaian</a>
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Edit Penilaian</Breadcrumb.Item>
                </Breadcrumb>
            )}
        >
            <Skeleton
                loading={isLoading || isLoadingDataJabatan || isLoadingUnor}
            >
                <EditFormPenilaian
                    form={form}
                    data={data}
                    loading={updatePenilaianMutation?.isLoading}
                    dataJabatan={dataJabatan}
                    dataUnor={dataUnor}
                    handleSubmit={handleSubmit}
                />
            </Skeleton>
        </PageContainer>
    );
};

TargetTahunan.Auth = {
    roles: ["USER"],
    groups: ["PTTPK"]
};

TargetTahunan.getLayout = function getLayout(page) {
    return <UserLayout title="Update Penilaian">{page}</UserLayout>;
};

export default TargetTahunan;
