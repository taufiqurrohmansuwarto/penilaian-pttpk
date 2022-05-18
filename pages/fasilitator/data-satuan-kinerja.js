import {
    Button,
    Drawer,
    Form,
    Input,
    message,
    Space,
    Table,
    Typography
} from "antd";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
    createSatuanKinerja,
    getSatuanKinerja,
    updateSatuanKinerja
} from "../../services/fasilitator.service";
import FasilitatorLayout from "../../src/components/FasilitatorLayout";

function DataSatuanKinerja() {
    const { data, isLoading } = useQuery(["data-satuan-kinerja"], () =>
        getSatuanKinerja()
    );

    const [visibleCreate, setVisibleCreate] = useState(false);
    const [visibleUpdate, setVisibleUpdate] = useState(false);
    const [currentRow, setCurrentRow] = useState();

    const queryClient = useQueryClient();

    const createMutation = useMutation((data) => createSatuanKinerja(data), {
        onSuccess: () => {
            message.success("Berhasil ditambahkan");
            queryClient.invalidateQueries(["data-satuan-kinerja"]);
            setVisibleCreate(false);
        },
        onError: () => message.error("Gagal")
    });

    const updateMutation = useMutation((data) => updateSatuanKinerja(data), {
        onSuccess: () => {
            message.success("Berhasil diupdate");
            queryClient.invalidateQueries(["data-satuan-kinerja"]);
            setVisibleUpdate(false);
        },
        onError: () => message.error("Gagal")
    });

    const [createForm] = Form.useForm();
    const [updateForm] = Form.useForm();

    const handleCreate = async () => {
        try {
            const result = await createForm.validateFields();
            createMutation.mutate(result);
        } catch (error) {}
    };
    const handleUpdate = async () => {
        try {
            const result = await updateForm.validateFields();
            updateMutation.mutate({
                id: currentRow?.id,
                data: { nama: result?.nama }
            });
        } catch (error) {}
    };

    useEffect(() => {
        updateForm.setFieldsValue({
            nama: currentRow?.nama
        });
    }, [currentRow]);

    const onCreate = () => {
        setVisibleCreate(true);
    };

    const onUpdate = (row) => {
        setVisibleUpdate(true);
        setCurrentRow(row);
    };

    const columns = [
        { dataIndex: "nama", title: "Nama" },
        {
            key: "aksi",
            title: "Aksi",
            render: (_, row) => {
                return (
                    <Space>
                        <Typography.Link onClick={() => onUpdate(row)}>
                            Ubah
                        </Typography.Link>
                    </Space>
                );
            }
        }
    ];

    return (
        <FasilitatorLayout title="Satuan Kinerja">
            <Table
                columns={columns}
                title={() => <Button onClick={onCreate}>Satuan Kinerja</Button>}
                pagination={false}
                loading={isLoading}
                dataSource={data}
                rowKey={(row) => row?.id}
            />
            <Drawer
                key="create"
                visible={visibleCreate}
                title="Buat Satuan Kinerja"
                onClose={() => setVisibleCreate(false)}
                destroyOnClose
                extra={[
                    <Button
                        type="primary"
                        onClick={handleCreate}
                        loading={createMutation.isLoading}
                    >
                        Submit
                    </Button>
                ]}
            >
                <Form form={createForm} requiredMark={false}>
                    <Form.Item
                        label="Nama"
                        name="nama"
                        rules={[
                            { required: true, message: "Tidak boleh kosong" }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Drawer>
            <Drawer
                key="update"
                visible={visibleUpdate}
                destroyOnClose
                title="Edit Satuan Kinerja"
                onClose={() => setVisibleUpdate(false)}
                extra={[
                    <Button
                        type="primary"
                        onClick={handleUpdate}
                        loading={updateMutation.isLoading}
                    >
                        Submit
                    </Button>
                ]}
            >
                <Form form={updateForm}>
                    <Form.Item
                        label="Nama"
                        name="nama"
                        required
                        rules={[
                            { required: true, message: "Tidak boleh kosong" }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Drawer>
        </FasilitatorLayout>
    );
}

DataSatuanKinerja.Auth = {
    roles: ["FASILITATOR", "ADMIN"],
    groups: ["PTTPK"]
};

export default DataSatuanKinerja;
