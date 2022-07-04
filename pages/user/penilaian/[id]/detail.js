import moment from "moment";
import { FileAddOutlined } from "@ant-design/icons";
import {
    Breadcrumb,
    Button,
    Card,
    Col,
    Descriptions,
    Divider,
    Drawer,
    Form,
    Input,
    InputNumber,
    message,
    Popconfirm,
    Row,
    Select,
    Space,
    Table,
    Typography
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
import UserLayout from "../../../../src/components/UserLayout";
import PageContainer from "../../../../src/components/PageContainer";
import Link from "next/link";

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

    useEffect(() => {
        editForm.setFieldsValue(initialValues);
    }, [initialValues]);

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
                queryClient.invalidateQueries(["target_penilaian", id]);
                form.resetFields();
                setVisible(false);
                message.success("Berhasil ditambahkan");
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
                    <Typography.Link
                        onClick={() => {
                            setVisibleEdit(true);
                            setInitialValues(row);
                        }}
                    >
                        Edit
                    </Typography.Link>
                    <Divider type="vertical" />
                    <Popconfirm
                        title="Apakah anda yakin menghapus target penilaian?"
                        onConfirm={() => handleRemove(row?.id)}
                    >
                        <Typography.Link>Hapus</Typography.Link>
                    </Popconfirm>
                </div>
            )
        }
    ];

    return (
        <PageContainer
            title="Target Penilaian"
            subTitle="PTTPK"
            style={{ minHeight: "95vh" }}
            breadcrumbRender={() => (
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link href="/user/penilaian">
                            <a>Penilaian</a>
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Target Penilaian</Breadcrumb.Item>
                </Breadcrumb>
            )}
        >
            <Card>
                <Card.Meta
                    title="Target Penilaian"
                    description="Target penilaian yang akan lakukan selama periode tertentu"
                />
                {dataRefSatuanKinerja && (
                    <>
                        <Drawer
                            key="create_target"
                            onClose={onClose}
                            visible={visible}
                            title="Buat Target Penilaian"
                            width={400}
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
                            <Form
                                form={form}
                                layout="vertical"
                                name="form-target"
                                hideRequiredMark
                            >
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
                                            <Input.TextArea placeholder="Masukkan target pekerjaan" />
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
                                                {dataRefSatuanKinerja?.map(
                                                    (d) => (
                                                        <Select.Option
                                                            nama={d?.nama}
                                                            key={d?.id}
                                                        >
                                                            {d?.nama}
                                                        </Select.Option>
                                                    )
                                                )}
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
                            width={500}
                            destroyOnClose
                            forceRender
                            extra={[
                                <Button onClick={handleUpdate} type="primary">
                                    Edit
                                </Button>
                            ]}
                        >
                            <Form
                                form={editForm}
                                name="edit-form"
                                initialValues={initialValues}
                            >
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
                                                {dataRefSatuanKinerja?.map(
                                                    (d) => (
                                                        <Select.Option
                                                            nama={d?.nama}
                                                            key={d?.id}
                                                            value={d.id}
                                                        >
                                                            {d?.nama}
                                                        </Select.Option>
                                                    )
                                                )}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </Drawer>
                        <Table
                            title={() => (
                                <Button
                                    onClick={showDrawer}
                                    icon={<FileAddOutlined />}
                                    type="primary"
                                >
                                    Target Penilaian
                                </Button>
                            )}
                            rowKey={(row) => row?.id}
                            dataSource={dataTargetPenilaian}
                            columns={columns}
                            pagination={false}
                        />
                    </>
                )}
            </Card>
        </PageContainer>
    );
};

DetailPenilaian.Auth = {
    roles: ["USER"],
    groups: ["PTTPK"]
};

DetailPenilaian.getLayout = function getLayout(page) {
    return <UserLayout title="Detail Penilaian">{page}</UserLayout>;
};

export default DetailPenilaian;
