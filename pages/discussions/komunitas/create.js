import { Button, Card, Form, Input, Select, Skeleton } from "antd";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import { getTopics } from "../../../services/main.services";
import Layout from "../../../src/components/Layout";

const CreateKomunitas = () => {
    const router = useRouter();

    const { data: dataTopics, isLoading: loadingTopics } = useQuery(
        ["topics"],
        () => getTopics()
    );

    const createKomunitasMutation = useMutation(
        (data) => createCommunity(data),
        {}
    );

    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        createKomunitasMutation.mutate(values);
    };

    return (
        <Layout title="Buat Komunitas">
            <Card>
                <Skeleton loading={loadingTopics}>
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            label="Judul"
                            name="title"
                            normalize={(e) => e?.replace(/\s/g, "")}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item label="Topik" name="topics">
                            <Select showSearch mode="multiple">
                                {dataTopics?.map((t) => (
                                    <Select.Option key={t?.topic}>
                                        {t?.topic}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Deskripsi" name="description">
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit">Submit</Button>
                        </Form.Item>
                    </Form>
                </Skeleton>
            </Card>
        </Layout>
    );
};

CreateKomunitas.auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["MASTER", "PTTPK"]
};

export default CreateKomunitas;
