import { EnterOutlined, EyeOutlined } from "@ant-design/icons";
import { Form, Input, Modal, Space, Table, Typography } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { getMail } from "../../../services/main.services";
import MailLayout from "../../../src/components/CustomLayout/MaiLayout";
import Layout from "../../../src/components/Layout";
import { capitalCase } from "../../../utils/utility";

const FormModal = ({ userData, visibility, closeModal }) => {
    const [form] = Form.useForm();

    return (
        <Modal
            title="Balas Pesan"
            visible={visibility}
            destroyOnClose
            onCancel={closeModal}
        >
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
