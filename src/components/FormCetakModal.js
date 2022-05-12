import { useDebouncedValue } from "@mantine/hooks";
import { Checkbox, DatePicker, Form, Input, Modal, Select, Spin } from "antd";
import FileSaver from "file-saver";
import { isEmpty } from "lodash";
import moment from "moment";
import "moment/locale/id";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
    cariPegawaiPNS,
    cetakPenilaianBulanan
} from "../../services/users.service";
moment.locale("id");

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
            const {
                tempat,
                tanggal,
                is_having_atasnama,
                pejabat_penandatangan,
                jabatan_penandatangan
            } = result;

            const currentTanggal = moment(tanggal).format("DD MMMM YYYY");
            const [nama, , nip, , , golongan, , pangkat] =
                pejabat_penandatangan?.label;

            const data = {
                tanggal: currentTanggal,
                tempat,
                is_having_atasnama,
                pejabat_penandatangan: {
                    nama,
                    nip,
                    golongan,
                    pangkat
                },
                jabatan_penandatangan
            };

            //harus mengirim data
            const hasil = await cetakPenilaianBulanan({
                bulan,
                tahun,
                data
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
            <Form form={form} layout="vertical" requiredMark={false}>
                <Form.Item
                    label="Tempat"
                    name="tempat"
                    help="Contoh. di Surabaya"
                    rules={[{ required: true, message: "Tidak boleh kosong" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Tanggal"
                    name="tanggal"
                    help="Tanggal Cetak"
                    rules={[{ required: true, message: "Tidak boleh kosong" }]}
                >
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
                    rules={[{ required: true, message: "Tidak boleh kosong" }]}
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
                    rules={[{ required: true, message: "Tidak boleh kosong" }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default FormCetakModal;
