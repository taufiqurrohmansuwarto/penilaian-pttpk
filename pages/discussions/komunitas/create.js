import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useId } from "@mantine/hooks";
import {
    Button,
    Card,
    Col,
    Form,
    Input,
    message,
    Row,
    Select,
    Skeleton,
    Space
} from "antd";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import { createCommunities, getTopics } from "../../../services/main.services";
import Layout from "../../../src/components/Layout";
import PageContainer from "../../../src/components/PageContainer";

const CreateRules = () => {
    return (
        <Form.List name="rules">
            {(fields, { add, remove }) => (
                <>
                    {fields.map(({ key, name, ...restFields }) => (
                        <Space
                            key={key}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignSelf: "stretch",
                                flexWrap: "wrap",
                                alignItems: "center",
                                marginBottom: 8
                            }}
                            align="baseline"
                        >
                            <Form.Item
                                label="Peraturan"
                                {...restFields}
                                name={[name, "title"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Peraturan harus di isi"
                                    }
                                ]}
                            >
                                <Input.TextArea />
                            </Form.Item>
                            <Form.Item
                                label="Deskripsi"
                                {...restFields}
                                name={[name, "description"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Deskripsi harus di isi"
                                    }
                                ]}
                            >
                                <Input.TextArea />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)} />
                        </Space>
                    ))}
                    <Form.Item>
                        <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                        >
                            Tambah Peraturan
                        </Button>
                    </Form.Item>
                </>
            )}
        </Form.List>
    );
};

const CreateCommunities = () => {
    const router = useRouter();

    const { data: dataTopics, isLoading: loadingTopics } = useQuery(
        ["topics"],
        () => getTopics()
    );

    const [form] = Form.useForm();
    const createMutation = useMutation((data) => createCommunities(data), {
        onSuccess: (data) => {
            router?.push(`/discussions/r/${data?.title}`);
            form.resetFields();
        },
        onError: (e) => {
            message.error(e);
        }
    });

    const handleSubmit = async (values) => {
        createMutation.mutate(values);
    };

    return (
        <Layout title="Buat Komunitas">
            <PageContainer
                title="Buat Komunitas"
                subTitle="Ayo buat komunitas yang berguna untuk kita semua :)"
            >
                <Row>
                    <Col span={12} offset={6}>
                        <Card title="Komunitas">
                            <Skeleton loading={loadingTopics}>
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={handleSubmit}
                                >
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
                                    {/* <CreateRules /> */}
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
                    </Col>
                </Row>
            </PageContainer>
        </Layout>
    );
};

CreateCommunities.auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["MASTER", "PTTPK"]
};

export default CreateCommunities;
