import { useDebouncedValue } from "@mantine/hooks";
import { Button, Card, Form, Input, message, Select, Spin } from "antd";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { findUsers, sendingEmail } from "../../services/main.services";
import MailLayout from "../../src/components/CustomLayout/MaiLayout";
import Layout from "../../src/components/Layout";
import RichTextEditor from "../../src/components/RichTextEditor";

const EmailForm = () => {
    const [form] = Form.useForm();
    const [nama, setNama] = useState("");
    const [debounceNama] = useDebouncedValue(nama, 500);

    const { data, isLoading } = useQuery(
        ["users", debounceNama],
        () => findUsers(debounceNama),
        {
            enabled: Boolean(debounceNama),
            refetchOnWindowFocus: false
        }
    );

    const { mutate: sendMail, isLoading: sendMailLoading } = useMutation(
        (data) => sendingEmail(data),
        {
            onSuccess: () => {
                message.success("berhasil");
                form.resetFields();
            },
            onError: () => message.error("gagal")
        }
    );

    const handleFinish = (values) => {
        const { message } = values;

        const result = message.replace(/<(.|\n)*?>/g, "").trim();
        if (!result) {
            return;
        } else {
            sendMail(values);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            requiredMark={false}
        >
            <Form.Item
                name="receiver"
                label="Kirim ke"
                rules={[{ required: true, message: "Tidak boleh kosong" }]}
            >
                <Select
                    showSearch
                    showArrow={false}
                    filterOption={false}
                    onSearch={(e) => setNama(e)}
                    allowClear
                    loading={isLoading}
                    defaultActiveFirstOption={false}
                    notFoundContent={isLoading ? <Spin size="small" /> : null}
                >
                    {data?.map((d) => (
                        <Select.Option value={d?.id} key={d?.id}>
                            {d?.value}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                name="subject"
                label="Subyek"
                rules={[{ required: true, message: "Tidak boleh kosong" }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="message"
                label="Pesan"
                rules={[{ required: true, message: "Tidak boleh kosong" }]}
            >
                <RichTextEditor />
            </Form.Item>
            <Form.Item>
                <Button
                    loading={sendMailLoading}
                    type="primary"
                    htmlType="submit"
                >
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

function Create() {
    return (
        <Card title="Pesan Baru">
            <EmailForm />
        </Card>
    );
}

Create.getLayout = function getLayout(page) {
    return (
        <Layout disableContentMargin={true}>
            <MailLayout>{page}</MailLayout>
        </Layout>
    );
};

Create.Auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["PTTPK", "MASTER"]
};

export default Create;
