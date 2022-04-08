import { Button, Card, Form, Input, message, Select, Skeleton } from "antd";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import { createCommunities, getTopics } from "../../../services/main.services";
import Layout from "../../../src/components/Layout";

const CreateCommunities = () => {
    const router = useRouter();

    const { data: dataTopics, isLoading: loadingTopics } = useQuery(
        ["topics"],
        () => getTopics()
    );

    const [form] = Form.useForm();
    const createMutation = useMutation((data) => createCommunities(data), {
        onSuccess: () => {
            message.success("test");
            form.resetFields();
        },
        onError: (e) => {
            message.error(e);
        }
    });

    const handleSubmit = async (values) => {
        const { topics, ...data } = values;
        createMutation.mutate(data);
    };

    return (
        <Layout title="Buat Komunitas">
            <Card title="Buat komunitas">
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
                        <Form.Item label="Deskripsi" name="content">
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                loading={createMutation.isLoading}
                                htmlType="submit"
                                type="primary"
                            >
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Skeleton>
            </Card>
        </Layout>
    );
};

CreateCommunities.auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["MASTER", "PTTPK"]
};

export default CreateCommunities;
