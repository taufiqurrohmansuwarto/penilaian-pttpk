import {
    Button,
    Card,
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

const CreatePenilaian = () => {
    const [form] = Form.useForm();
    const router = useRouter();

    const [nip, setNip] = useState("");
    const [debounceValue] = useDebouncedValue(nip, 500);

    const { data: dataPns, isLoading: isLoadingPNS } = useQuery(
        ["pegawai", debounceValue],
        () => cariPegawaiPNS(debounceValue),
        {
            enabled: Boolean(debounceValue)
        }
    );

    // atasan banding
    const [nipAtasanBanding, setNipAtasanBanding] = useState("");
    const [debounceValueAtasanBanding] = useDebouncedValue(
        nipAtasanBanding,
        500
    );

    const { data: dataAtasanBanding, isLoading: isLoadingAtasanBanding } =
        useQuery(
            ["atasanBanding", debounceValueAtasanBanding],
            () => cariPegawaiPNS(debounceValueAtasanBanding),
            {
                enabled: Boolean(debounceValueAtasanBanding)
            }
        );

    // eselon 2
    const [nipEselon2, setNipEselon2] = useState("");
    const [debounceValueNipEselon2] = useDebouncedValue(nipEselon2, 500);

    const { data: dataEselon2, isLoading: isLoadingEselon2 } = useQuery(
        ["atasanBanding", debounceValueNipEselon2],
        () => cariPegawaiPNS(debounceValueNipEselon2),
        {
            enabled: Boolean(debounceValueNipEselon2)
        }
    );

    const { data: dataJabatan, isLoading: isLoadingJabatan } = useQuery(
        ["jabatan"],
        () => getJabatan()
    );

    const { data: dataUnor, isLoading: isloadingUnor } = useQuery(
        ["unor"],
        () => getUnor()
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

    const handleSearch = (e) => {
        if (!e) {
            return;
        } else {
            setNip(e);
        }
    };

    return (
        <UserLayout title="Buat Penilaian">
            <Card loading={isLoadingJabatan || isloadingUnor}>
                {dataJabatan && dataUnor && (
                    <Form form={form} onFinish={onFinish} layout="vertical">
                        {debounceValue}
                        <Form.Item name="tahun" label="Tahun">
                            <InputNumber />
                        </Form.Item>
                        <Form.Item
                            label="Atasan Langsung"
                            name="nip_atasan_langsung"
                            help="Ketikkan NIP"
                        >
                            <Select
                                showSearch
                                labelInValue
                                showArrow={false}
                                filterOption={false}
                                onSearch={handleSearch}
                                allowClear
                                loading={isLoadingPNS}
                                defaultActiveFirstOption={false}
                                notFoundContent={
                                    isLoadingPNS ? <Spin size="small" /> : null
                                }
                            >
                                {!isEmpty(dataPns) && (
                                    <Select.Option key={dataPns?.pegawai_id}>
                                        {dataPns?.nama} - {dataPns?.nip}
                                    </Select.Option>
                                )}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Atasan Banding"
                            name="nip_atasan_banding"
                        >
                            <Select
                                showSearch
                                labelInValue
                                showArrow={false}
                                filterOption={false}
                                onSearch={(e) => setNipAtasanBanding(e)}
                                allowClear
                                loading={isLoadingAtasanBanding}
                                defaultActiveFirstOption={false}
                                notFoundContent={
                                    isLoadingAtasanBanding ? (
                                        <Spin size="small" />
                                    ) : null
                                }
                            >
                                {!isEmpty(dataAtasanBanding) && (
                                    <Select.Option
                                        key={dataAtasanBanding?.pegawai_id}
                                    >
                                        {dataAtasanBanding?.nama} -{" "}
                                        {dataAtasanBanding?.nip}
                                    </Select.Option>
                                )}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Kepala Badan/Dinas" name="nip_kepala">
                            <Select
                                showSearch
                                labelInValue
                                showArrow={false}
                                filterOption={false}
                                onSearch={(e) => setNipEselon2(e)}
                                allowClear
                                loading={isLoadingEselon2}
                                defaultActiveFirstOption={false}
                                notFoundContent={
                                    isLoadingEselon2 ? (
                                        <Spin size="small" />
                                    ) : null
                                }
                            >
                                {!isEmpty(dataEselon2) && (
                                    <Select.Option
                                        key={dataEselon2?.pegawai_id}
                                    >
                                        {dataEselon2?.nama} - {dataEselon2?.nip}
                                    </Select.Option>
                                )}
                            </Select>
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
