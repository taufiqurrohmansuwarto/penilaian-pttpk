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
                        {dataPns?.nama} - {dataPns?.nip}
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
        console.log(values);
        // createPenilaianMutation.mutate(values);
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
                            label="Atasan Langsung"
                            name="nip_atasan"
                        />
                        <FormPegawaiPNS
                            label="Atasan Banding"
                            name="nip_atasan_banding"
                        />
                        <FormPegawaiPNS
                            label="Kepala Badan/Dinas"
                            name={"nip_eselon_ii"}
                        />
                        <Form.Item name="periode" label="Periode">
                            <DatePicker.RangePicker format="DD-MM-YYYY" />
                        </Form.Item>
                        <Form.Item
                            help="Data diambil dari aplikasi pttpk dengan jabatan yang tidak kosong"
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
                                labelInValue
                                showSearch
                                treeNodeFilterProp="title"
                                treeData={dataUnor}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit">Submit</Button>
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
