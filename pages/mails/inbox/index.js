import { EnterOutlined, EyeOutlined } from "@ant-design/icons";
import { Form, Input, Modal, Space, Table, Typography } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { getMail, sendingEmail } from "../../../services/main.services";
import MailLayout from "../../../src/components/CustomLayout/MaiLayout";
import Layout from "../../../src/components/Layout";
import { capitalCase } from "../../../utils/utility";

const FormModal = ({ userData, visibility, closeModal }) => {
    const [form] = Form.useForm();

    const router = useRouter();

    const { mutate: send, isLoading: sendMailLoading } = useMutation(
        (data) => sendingEmail(data),
        {
            onSuccess: () => {
                router.push("/mails/sents");
            }
        }
    );

    const onOk = async () => {
        const result = await form.validateFields();
        const { author, subject } = userData;

        const data = {
            message: result?.message,
            subject,
            receiver: author?.custom_id
        };

        send(data);
    };

    return (
        <Modal
            title="Balas Pesan"
            visible={visibility}
            destroyOnClose
            onCancel={closeModal}
            onOk={onOk}
            confirmLoading={sendMailLoading}
            width={800}
        >
            <div style={{ marginBottom: 10 }}>
                Ke : {userData?.author?.username}
            </div>
            <div style={{ marginBottom: 8 }}>Subyek : {userData?.subject}</div>
            <Form form={form}>
                <Form.Item
                    name="message"
                    label="Pesan"
                    rules={[{ required: true, message: "Tidak boleh kosong" }]}
                >
                    <Input.TextArea rows={10} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

const MailTable = ({ data, loading }) => {
    const router = useRouter();

    const [visibility, setVisibility] = useState(false);
    const [userData, setUserData] = useState(null);

    const closeModal = () => setVisibility(false);
    const opeModal = (row) => {
        setUserData(row);
        setVisibility(true);
    };

    const gotoDetail = (id) => {
        router.push(`/mails/inbox/${id}`);
    };

    const isRead = (row) => {
        return !row?.users_messages_mapped[0]?.is_read;
    };

    const columns = [
        {
            title: "Dari",
            dataIndex: "name",
            width: 250,
            render: (_, row) => (
                <Typography.Text strong={isRead(row)} ellipsis>
                    {capitalCase(row?.author?.username)}
                </Typography.Text>
            )
        },
        { title: "Subyek", dataIndex: "subject", key: "subject" },
        {
            title: "Pesan",
            dataIndex: "body",
            render: (_, row) => (
                <Typography.Text
                    strong={isRead(row)}
                    ellipsis
                    style={{ width: 500 }}
                >
                    {row?.body}
                </Typography.Text>
            )
        },
        {
            title: "Waktu",
            dataIndex: "waktu",
            width: 150,
            render: (_, row) => (
                <Typography.Text strong={isRead(row)}>
                    {moment(row?.date).format("l")}
                </Typography.Text>
            )
        },
        {
            title: "Aksi",
            dataIndex: "aksi",
            width: 100,
            render: (_, row) => (
                <Space>
                    <Typography.Link onClick={() => gotoDetail(row?.id)}>
                        <EyeOutlined />
                    </Typography.Link>
                    <Typography.Link onClick={() => opeModal(row)}>
                        Balas
                    </Typography.Link>
                </Space>
            )
        }
    ];

    return (
        <>
            <FormModal
                visibility={visibility}
                closeModal={closeModal}
                userData={userData}
            />
            <Table
                rowKey={(row) => row?.id}
                rowSelection
                loading={loading}
                columns={columns}
                size="small"
                dataSource={data}
                pagination={false}
            />
        </>
    );
};

function Mails() {
    const { data, isLoading } = useQuery(["mails", "inbox"], () =>
        getMail("inbox")
    );

    return <MailTable data={data} loading={isLoading} />;
}

Mails.getLayout = function getLayout(page) {
    return (
        <Layout disableContentMargin={true}>
            <MailLayout>{page}</MailLayout>
        </Layout>
    );
};

Mails.Auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["PTTPK", "MASTER"]
};

export default Mails;
