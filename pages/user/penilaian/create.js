import moment from "moment";
import {
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
        <Form.Item label={label} name={name}>
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
            refetchOnWindowFocus: false
        }
    );

    const { data: dataUnor, isLoading: isloadingUnor } = useQuery(
        ["unor"],
        () => getUnor(),
        {
            refetchOnWindowFocus: false
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
            nip_atasan_langsung,
            nip_atasan_banding,
            nip_eselon_ii,
            periode,
            tahun
        } = values;
        const [awal, akhir] = periode;
        const awal_periode = moment(awal).toISOString();
        const akhir_periode = moment(akhir).toISOString();
        const jabatan = dataJabatan?.find(
            (jabatan) => parseInt(jabatan?.id) === parseInt(id_jabatan)
        );

        const id_atasan_langsung = nip_atasan_langsung?.value;
        const id_atasan_banding = nip_atasan_banding?.value;
        const id_eselon_ii = nip_eselon_ii?.value;

        const data = {
            nip_atasan_banding: id_atasan_banding?.toString(),
            nip_atasan_langsung: id_atasan_langsung?.toString(),
            nip_eselon_ii: id_eselon_ii?.toString(),
            awal_periode,
            akhir_periode,
            id_jabatan,
            atasan_langsung: nip_atasan_langsung,
            atasan_banding: nip_atasan_banding,
            eselon_ii: nip_eselon_ii,
            jabatan,
            tahun,
            id_skpd
        };

        createPenilaianMutation.mutate(data);
    };

    return (
        <UserLayout title="Buat Penilaian">
            <Card loading={isLoadingJabatan || isloadingUnor}>
                {dataJabatan && dataUnor && (
                    <Form form={form} onFinish={onFinish} layout="vertical">
                        <Form.Item name="tahun" label="Tahun">
                            <InputNumber />
                        </Form.Item>
                        <FormPegawaiPNS
                            label="Atasan Langsung (Subordinator)"
                            name="nip_atasan_langsung"
                        />
                        <FormPegawaiPNS
                            label="Atasan Banding (Eselon III)"
                            name="nip_atasan_banding"
                        />
                        <FormPegawaiPNS
                            label="Kepala Badan/Dinas (Eselon II)"
                            name={"nip_eselon_ii"}
                        />
                        <Form.Item
                            name="periode"
                            label="Periode"
                            help="Periode awal Penilaian dan akhir penilaian"
                        >
                            <DatePicker.RangePicker format="DD-MM-YYYY" />
                        </Form.Item>
                        <Form.Item
                            help="Pilih Jabatan yang akan dilakukan penilaian"
                            name="id_jabatan"
                            label="Jabatan"
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
                        <Form.Item name="id_skpd" label="Unit Kerja">
                            <TreeSelect
                                // labelInValue
                                showSearch
                                treeNodeFilterProp="title"
                                treeData={dataUnor}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit" type="primary">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Card>
        </UserLayout>
    );
};

CreatePenilaian.Auth = {
    roles: ["USER"],
    groups: ["PTTPK"]
};

export default CreatePenilaian;
