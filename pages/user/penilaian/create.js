import moment from "moment";
import {
    Breadcrumb,
    Button,
    Card,
    DatePicker,
    Form,
    InputNumber,
    message,
    Select,
    Spin,
    TreeSelect
} from "antd";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import {
    buatPenilaian,
    cariPegawaiPNS,
    getJabatan,
    getUnor
} from "../../../services/users.service";
import UserLayout from "../../../src/components/UserLayout";
import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { isEmpty } from "lodash";
import PageContainer from "../../../src/components/PageContainer";
import Link from "next/link";

const FormPegawaiPNS = ({ name, label }) => {
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
        <Form.Item
            label={label}
            name={name}
            help="Ketikkan NIP PNS yang dicari"
            rules={[{ required: true, message: "tidak boleh kosong" }]}
        >
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

const CreatePenilaian = () => {
    const [form] = Form.useForm();
    const router = useRouter();

    const { data: dataJabatan, isLoading: isLoadingJabatan } = useQuery(
        ["jabatan"],
        () => getJabatan(),
        {
            refetchOnWindowFocus: false,
            retryOnMount: false,
            refetchOnMount: false
        }
    );

    const { data: dataUnor, isLoading: isloadingUnor } = useQuery(
        ["unor"],
        () => getUnor(),
        {
            refetchOnWindowFocus: false,
            retryOnMount: false,
            refetchOnMount: false
        }
    );

    const createPenilaianMutation = useMutation((data) => buatPenilaian(data), {
        onError: (error) => {
            console.log(error);
        },
        onSuccess: () => {
            message.success("Penilaian Berhasil ditambahkan");
            router.push("/user/penilaian");
        }
    });

    const onFinish = (values) => {
        const {
            id_jabatan,
            id_skpd,
            atasan_banding,
            atasan_langsung,
            eselon_ii,
            periode,
            tahun,
            pengalaman_kerja
        } = values;
        const [awal, akhir] = periode;
        const awal_periode = moment(awal).toISOString();
        const akhir_periode = moment(akhir).toISOString();
        const jabatan = dataJabatan?.find(
            (jabatan) => parseInt(jabatan?.id) === parseInt(id_jabatan)
        );

        const id_atasan_langsung = atasan_langsung?.value;
        const id_atasan_banding = atasan_banding?.value;
        const id_eselon_ii = eselon_ii?.value;

        const data = {
            id_atasan_banding: `master|${id_atasan_banding?.toString()}`,
            id_atasan_langsung: `master|${id_atasan_langsung?.toString()}`,
            id_eselon_ii: `master|${id_eselon_ii?.toString()}`,
            awal_periode,
            akhir_periode,
            id_jabatan,
            atasan_langsung,
            atasan_banding,
            eselon_ii,
            jabatan,
            tahun,
            id_skpd,
            pengalaman_kerja
        };

        createPenilaianMutation.mutate(data);
    };

    return (
        <PageContainer
            title="Buat Penilaian Baru"
            subTitle="PTTPK"
            breadcrumbRender={() => (
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link href="/user/penilaian">
                            <a>Daftar Penilaian</a>
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Buat Penilaian</Breadcrumb.Item>
                </Breadcrumb>
            )}
        >
            <Card loading={isLoadingJabatan || isloadingUnor}>
                {dataJabatan && dataUnor && (
                    <Form
                        form={form}
                        onFinish={onFinish}
                        layout="vertical"
                        requiredMark={false}
                    >
                        <Form.Item
                            name="tahun"
                            label="Tahun"
                            rules={[
                                {
                                    required: true,
                                    message: "Tidak boleh kosong"
                                }
                            ]}
                        >
                            <InputNumber />
                        </Form.Item>
                        <FormPegawaiPNS
                            label="Penilai"
                            name="atasan_langsung"
                        />
                        <FormPegawaiPNS
                            label="Atasan Banding (Eselon III)"
                            name="atasan_banding"
                        />
                        <FormPegawaiPNS
                            label="Kepala Badan/Dinas (Eselon II)"
                            name="eselon_ii"
                        />
                        <Form.Item
                            name="periode"
                            label="Periode"
                            help="Periode awal Penilaian dan akhir penilaian"
                            rules={[
                                {
                                    required: true,
                                    message: "Tidak boleh kosong"
                                }
                            ]}
                        >
                            <DatePicker.RangePicker format="DD-MM-YYYY" />
                        </Form.Item>
                        <Form.Item
                            help="Pilih Jabatan yang akan dilakukan penilaian"
                            name="id_jabatan"
                            label="Jabatan"
                            rules={[
                                {
                                    required: true,
                                    message: "Tidak boleh kosong"
                                }
                            ]}
                        >
                            <Select showSearch optionFilterProp="name">
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
                            rules={[
                                {
                                    required: true,
                                    message: "Tidak boleh kosong"
                                }
                            ]}
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
                            help="Dalam tahun"
                        >
                            <InputNumber max={100} min={0} defaultValue={0} />
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit" type="primary">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Card>
        </PageContainer>
    );
};

CreatePenilaian.Auth = {
    roles: ["USER"],
    groups: ["PTTPK"]
};

CreatePenilaian.getLayout = function getLayout(page) {
    return <UserLayout title="Buat Penilaian">{page}</UserLayout>;
};

export default CreatePenilaian;
