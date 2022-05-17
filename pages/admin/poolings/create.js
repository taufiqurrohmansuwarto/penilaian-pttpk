import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Button, DatePicker, Space, Form, Input, message, Card } from "antd";
import AdminLayout from "../../../src/components/AdminLayout";
import PageContainer from "../../../src/components/PageContainer";
import moment from "moment";
import { useMutation } from "react-query";
import { createPooling } from "../../../services/admin.service";
import { useRouter } from "next/router";

function Create() {
    const [form] = Form.useForm();
    const router = useRouter();

    const { mutate: create } = useMutation((data) => createPooling(data), {
        onError: () => message.error("error"),
        onSuccess: () => router.push("/admin/poolings")
    });

    const handleSubmit = (values) => {
        const { due_date, ...data } = values;
        const newDueDate = moment(due_date).format();
        const dataSend = { ...data, due_date: newDueDate };
        create(dataSend);
    };

    return (
        <PageContainer
            title="Pooling"
            subTitle="Poolingku"
            style={{ minHeight: "95vh" }}
            onBack={() => router?.back()}
        >
            <Card>
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item name="title" label="Judul Pooling">
                        <Input />
                    </Form.Item>
                    <Form.Item name="due_date" label="Sampai Tanggal">
                        <DatePicker />
                    </Form.Item>
                    <Form.List name="poolings_answers">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space
                                        key={key}
                                        style={{
                                            display: "flex",
                                            marginBottom: 8
                                        }}
                                        align="baseline"
                                    >
                                        <Form.Item
                                            {...restField}
                                            name={[name, "answer"]}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Missing jawaban"
                                                }
                                            ]}
                                            label="Jawaban"
                                        >
                                            <Input />
                                        </Form.Item>
                                        <MinusCircleOutlined
                                            onClick={() => remove(name)}
                                        />
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        block
                                        icon={<PlusOutlined />}
                                    >
                                        Tambah Jawaban
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                    <Form.Item>
                        <Button htmlType="submit" type="primary">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </PageContainer>
    );
}

Create.Auth = {
    isAdmin: true
};

Create.getLayout = function getLayout(page) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default Create;
