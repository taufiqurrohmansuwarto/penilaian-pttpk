import Layout from "../../../src/components/Layout";
import { Button, Select, Card, Form, Input } from "antd";
import { toUpper } from "lodash";

const CreateKomunitas = () => {
    // fetch some topics eg : hobbies, dsb

    // ada name (ndak boleh pakai spasi), topics, description
    const [form] = Form.useForm();

    const handleSubmit = async () => {
        try {
        } catch (error) {}
    };

    return (
        <Layout title="Buat Komunitas">
            <Card>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        label="Judul"
                        name="title"
                        normalize={(e) => e?.replace(/\s/g, "")}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Topik" name="topics">
                        <Select showSearch mode="multiple"></Select>
                    </Form.Item>
                    <Form.Item label="Deskripsi" name="description">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>
            </Card>
        </Layout>
    );
};

CreateKomunitas.auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["MASTER", "PTTPK"]
};

export default CreateKomunitas;
