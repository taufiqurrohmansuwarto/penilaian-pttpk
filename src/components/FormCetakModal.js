import { useDebouncedValue } from "@mantine/hooks";
import { Checkbox, DatePicker, Form, Input, Modal, Select, Spin } from "antd";
import FileSaver from "file-saver";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
    cariPegawaiPNS,
    cetakPenilaianBulanan
} from "../../services/users.service";

function FormCetakModal({ visible, onCancel, form, bulan, tahun, onClose }) {
    useEffect(() => {
        form.resetFields();
    }, [visible, bulan, tahun]);

    const [nip, setNip] = useState();
    const [debounceValue] = useDebouncedValue(nip, 500);
    const [loading, setLoading] = useState(false);

    const { data: dataPns, isLoading: isLoadingPNS } = useQuery(
        ["pegawai", debounceValue],
        () => cariPegawaiPNS(debounceValue),
        {
            enabled: Boolean(debounceValue),
            refetchOnWindowFocus: false
        }
    );

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const result = await form.validateFields();
            const hasil = await cetakPenilaianBulanan({
                bulan,
                tahun,
                data: {}
            });
            await FileSaver.saveAs(hasil, "bulanan.pdf");
            onClose();
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };
    return (
        <Modal
            title="Cetak Penilaian Bulanan"
            width={800}
            visible={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            confirmLoading={loading}
            centered
            destroyOnClose
        >
            <Form form={form} layout="vertical" name="tempat">
                <Form.Item label="Tempat" help="Contoh. di Surabaya">
                    <Input />
                </Form.Item>
                <Form.Item label="Tanggal" name="tanggal" help="Tanggal Cetak">
                    <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item
                    label="Atas Nama?"
                    name="is_having_atasnama"
                    valuePropName="checked"
                >
                    <Checkbox>Pakai</Checkbox>
                </Form.Item>
                <Form.Item
                    label="Penandata tangan/PNS"
                    name="pejabat_penandatangan"
                    help="Ketik NIP untuk mencari nama PNS"
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
                        notFoundContent={
                            isLoadingPNS ? <Spin size="small" /> : null
                        }
                    >
                        {!isEmpty(dataPns) && (
                            <Select.Option
                                value={dataPns?.pegawai_id}
                                key={dataPns?.pegawai_id}
                            >
                                {dataPns?.nama}({dataPns?.nip}) -{" "}
                                {dataPns?.golongan}({dataPns?.pangkat})
                            </Select.Option>
                        )}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Jabatan Penanda tangan"
                    name="jabatan_penandatangan"
                    help="Contoh. Kepala Badan Kepegawaian Daerah / Kepala Bidang P3DASI / Sekretaris BKD Provinsi Jawa Timur"
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default FormCetakModal;
