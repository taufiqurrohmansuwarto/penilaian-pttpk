import { FileAddOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Table } from "antd";
import { useState } from "react";
import EsignFasilitatorLayout from "../../../src/components/Layout/EsignFasilitatorLayout";
import PageContainer from "../../../src/components/PageContainer";

const ListPermohonan = ({ data, loading }) => {
    const columns = [{}];
    return <Table columns={columns} dataSource={data} loading={loading} />;
};

const RequestModal = ({ visible, onCancel }) => {
    const [form] = Form.useForm();

    const onConfirm = async () => {
        try {
            await form.validateFields();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal
            centered
            onOk={onConfirm}
            title="Permohonan TTE Dokumen Kolektif"
            visible={visible}
            onCancel={onCancel}
            width={800}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Judul"
                    help="Contoh. Sertifikat pelatihan menggambar"
                    name="name"
                    rules={[
                        { required: true, message: "Judul tidak boleh kosong" }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Tipe dokumen"
                    name="document_type"
                    rules={[
                        {
                            required: true,
                            message: "Tipe dokumen tidak boleh kosong"
                        }
                    ]}
                >
                    <Select showSearch optionFilterProp="title">
                        <Select.Option value="sertifikat" title="Sertifikat">
                            Sertifikat
                        </Select.Option>
                        <Select.Option
                            value="surat_keputusan"
                            title="Surat Keputusan"
                        >
                            Surat Keputusan
                        </Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    help="Nama penandatangan akan keluar, jika penandatangan sudah memiliki TTE secara personal"
                    rules={[
                        {
                            required: true,
                            message: "Nama Penandatangan tidak boleh kosong"
                        }
                    ]}
                    label="Penanda Tangan"
                    name="employee_id"
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

const DashboardEsign = () => {
    const [showModal, setShowModal] = useState();
    const handleShowModal = () => setShowModal(true);
    const handleCancelModal = () => setShowModal(false);

    return (
        <PageContainer title="Permohonan" subTitle="TTE Dokumen kolektif">
            <RequestModal visible={showModal} onCancel={handleCancelModal} />
            <Button
                type="primary"
                icon={<FileAddOutlined />}
                onClick={handleShowModal}
            >
                Buat Permohonan
            </Button>
        </PageContainer>
    );
};

DashboardEsign.Auth = {
    roles: ["FASILITATOR", "ADMIN"],
    groups: ["MASTER"]
};

DashboardEsign.getLayout = function getLayout(page) {
    return <EsignFasilitatorLayout>{page}</EsignFasilitatorLayout>;
};

export default DashboardEsign;
