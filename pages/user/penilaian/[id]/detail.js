import {
    Button,
    Col,
    Drawer,
    Form,
    Input,
    InputNumber,
    message,
    Row,
    Select,
    Space,
    Table
} from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getRefSatuanKinerja } from "../../../../services/ref.service";
import {
    createTargetPenilaian,
    detailPenilaian,
    getTargetPenilaian,
    removeTargetPenilaian,
    updateTargetPenilaian
} from "../../../../services/users.service";

const CreateTarget = () => {};

const DetailPenilaian = () => {
    const {
        query: { id }
    } = useRouter();

    const [initialValues, setInitialValues] = useState({});

    const [visible, setVisible] = useState(false);
    const [visibleEdit, setVisibleEdit] = useState(false);
    const queryClient = useQueryClient();

    const [form] = Form.useForm();
    const [editForm] = Form.useForm();

    useEffect(() => {}, [initialValues]);

    const onClose = () => setVisible(false);
    const showDrawer = () => setVisible(true);

    const onCloseEdit = () => setVisibleEdit(false);
    const showDrawerEdit = () => setVisibleEdit(true);

    const { data } = useQuery(["penilaian", id], () => detailPenilaian(id), {
        enabled: !!id
    });

    // target penilaian
    const { data: dataTargetPenilaian } = useQuery(
        ["target_penilaian", id],
        () => getTargetPenilaian(id),
        {
            enabled: !!id
        }
    );

    const createTargetPenilaianMutation = useMutation(
        (data) => createTargetPenilaian(data),
        {
            onError: (error) => message.error(error),
            onSuccess: () => {
                message.success("Berhasil dibuat");
                queryClient.invalidateQueries(["target_penilaian", id]);
                form.resetFields();
                setVisible(false);
            }
        }
    );

    const removeTargetPenilaianMutation = useMutation(
        (data) => removeTargetPenilaian(data),
        {
            onError: (error) => message.error(error),
            onSuccess: () => {
                message.success("Berhasil dihapus");
                queryClient.invalidateQueries(["target_penilaian", id]);
            }
        }
    );

    const updateTargetPenilaianMutation = useMutation(
        (data) => updateTargetPenilaian(data),
        {
            onSuccess: () => {
                message.success("Berhasil diupdate");
                queryClient.invalidateQueries(["target_penilaian", id]);
                setVisibleEdit(false);
            }
        }
    );

    const { data: dataRefSatuanKinerja } = useQuery("refSatuanKinerja", () =>
        getRefSatuanKinerja()
    );

    const handleSubmitCreate = async () => {
        try {
            const values = await form.validateFields();
            const data = { id, data: values };
            createTargetPenilaianMutation.mutate(data);
        } catch (error) {}
    };

    const handleRemove = (targetId) => {
        const data = { id, targetId };
        removeTargetPenilaianMutation.mutate(data);
    };

    const handleUpdate = async () => {
        try {
            const { id: targetId } = initialValues;
            const values = await editForm.validateFields();

            const data = { id, data: values, targetId };
            updateTargetPenilaianMutation.mutate(data);
        } catch (error) {}
    };

    const columns = [
        { dataIndex: "pekerjaan", title: "Pekerjaan" },
        { dataIndex: "kuantitas", title: "Kuantitas" },
        {
            key: "satuan",
            title: "Satuan",
            render: (_, row) => <div>{row?.ref_satuan_kinerja?.nama}</div>
        },
        {
            key: "action",
            title: "Action",
            render: (_, row) => (
                <div>
                    <Space>
                        <Button onClick={() => handleRemove(row?.id)}>
                            Hapus
                        </Button>
                        <Button
                            onClick={() => {
                                setVisibleEdit(true);
                                setInitialValues(row);
                            }}
                        >
                            Update
                        </Button>
                    </Space>
                </div>
            )
        }
    ];

    return (
        <div>
            {dataRefSatuanKinerja && (
                <>
                    <Drawer
                        key="create_target"
                        onClose={onClose}
                        visible={visible}
                        title="Buat Target Penilaian"
                        width={720}
                        extra={[
                            <Button
                                loading={
                                    createTargetPenilaianMutation.isLoading
                                }
                                onClick={handleSubmitCreate}
                                type="primary"
                            >
                                Submit
                            </Button>
                        ]}
                    >
                        <Form form={form} layout="vertical" hideRequiredMark>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        name="pekerjaan"
                                        label="Pekerjaan"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Pekerjaan Tidak boleh kosong"
                                            }
                                        ]}
                                    >
                                        <Input placeholder="Masukkan target pekerjaan" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="kuantitas"
                                        label="Kuantitas"
                                        help="Jumlah Satuan"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please select an owner"
                                            }
                                        ]}
                                    >
                                        <InputNumber
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="ref_satuan_kinerja_id"
                                        label="Satuan"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Satuan Tidak boleh kosong"
                                            }
                                        ]}
                                    >
                                        <Select
                                            placeholder="Pilih Satuan"
                                            showSearch
                                            optionFilterProp="nama"
                                            allowClear
                                        >
                                            {dataRefSatuanKinerja?.map((d) => (
                                                <Select.Option
                                                    nama={d?.nama}
                                                    key={d?.id}
                                                >
                                                    {d?.nama}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Drawer>

                    <Drawer
                        key="edit_target"
                        onClose={onCloseEdit}
                        visible={visibleEdit}
                        title="Edit Target Penilaian"
                        width={720}
                        destroyOnClose
                        forceRender
                        extra={[
                            <Button onClick={handleUpdate} type="primary">
                                Edit
                            </Button>
                        ]}
                    >
                        <Form form={editForm} initialValues={initialValues}>
                            {JSON.stringify(initialValues)}
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        name="pekerjaan"
                                        label="Pekerjaan"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Pekerjaan Tidak boleh kosong"
                                            }
                                        ]}
                                    >
                                        <Input placeholder="Masukkan target pekerjaan" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="kuantitas"
                                        label="Kuantitas"
                                        help="Jumlah Satuan"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please select an owner"
                                            }
                                        ]}
                                    >
                                        <InputNumber
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="ref_satuan_kinerja_id"
                                        label="Satuan"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Satuan Tidak boleh kosong"
                                            }
                                        ]}
                                    >
                                        <Select
                                            placeholder="Pilih Satuan"
                                            showSearch
                                            optionFilterProp="nama"
                                            allowClear
                                        >
                                            {dataRefSatuanKinerja?.map((d) => (
                                                <Select.Option
                                                    nama={d?.nama}
                                                    key={d?.id}
                                                    value={d.id}
                                                >
                                                    {d?.nama}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Drawer>

                    <Button onClick={showDrawer}>Create</Button>
                    <Table
                        dataSource={dataTargetPenilaian}
                        columns={columns}
                        pagination={false}
                    />
                </>
            )}
        </div>
    );
};

DetailPenilaian.Auth = {
    roles: ["USER"],
    groups: ["PTTPK"]
};

export default DetailPenilaian;
