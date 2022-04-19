import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import { getRefSatuanKinerja } from "../../../../services/ref.service";
import UserLayout from "../../../../src/components/UserLayout";
import {
    cariPegawaiPNS,
    detailPenilaian,
    getJabatan,
    getUnor
} from "../../../../services/users.service";
import { useEffect, useState } from "react";
import {
    Button,
    DatePicker,
    Form,
    InputNumber,
    Select,
    Skeleton,
    Spin,
    TreeSelect
} from "antd";
import moment from "moment";
import { useDebouncedValue } from "@mantine/hooks";
import { isEmpty } from "lodash";

const FormPegawaiPNS = ({ form, name }) => {
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
        <Form.Item name={name}>
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

const EditFormPenilaian = ({ form, data, dataJabatan, dataUnor }) => {
    useEffect(() => {
        form.setFieldsValue({
            tahun: data?.tahun,
            periode: [moment(data?.awal_periode), moment(data?.akhir_periode)],
            id_jabatan: data?.id_jabatan,
            id_skpd: data?.id_skpd,
            atasan_langsung: data?.atasan_langsung
        });
    }, [data]);

    const handleSubmit = (values) => {
        console.log(values);
    };

    return (
        <div>
            <Form form={form} onFinish={handleSubmit}>
                <Form.Item name="tahun">
                    <InputNumber />
                </Form.Item>
                <Form.Item name="periode">
                    <DatePicker.RangePicker />
                </Form.Item>
                <FormPegawaiPNS name="atasan_langsung" />
                <Form.Item name="id_jabatan">
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
                <Form.Item name="id_skpd">
                    <TreeSelect
                        // labelInValue
                        showSearch
                        treeNodeFilterProp="title"
                        treeData={dataUnor}
                    />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

const TargetTahunan = () => {
    const {
        query: { id }
    } = useRouter();

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

    const updatePenilaianMutation = useMutation();

    return (
        <UserLayout>
            <Skeleton
                loading={isLoading || isLoadingDataJabatan || isLoadingUnor}
            >
                {JSON.stringify(data)}
                <EditFormPenilaian
                    form={form}
                    data={data}
                    dataJabatan={dataJabatan}
                    dataUnor={dataUnor}
                />
            </Skeleton>
        </UserLayout>
    );
};

TargetTahunan.Auth = {
    roles: ["USER"],
    groups: ["PTTPK"]
};

export default TargetTahunan;
