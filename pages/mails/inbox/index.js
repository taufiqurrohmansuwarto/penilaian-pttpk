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

const MailTable = ({ data, loading, handleChangePage }) => {
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
        { title: "Subyek", dataIndex: "subject", key: "subject", width: 200 },
        {
            title: "Pesan",
            dataIndex: "body",
            width: 600,
            render: (_, row) => (
                <Typography.Text
                    strong={isRead(row)}
                    ellipsis
                    style={{ width: 500 }}
                >
                    <div dangerouslySetInnerHTML={{ __html: row?.body }} />
                </Typography.Text>
            )
        },
        {
            title: "Waktu",
            dataIndex: "waktu",
            width: 300,
            render: (_, row) => (
                <Typography.Text strong={isRead(row)}>
                    {moment(row?.date).format("lll")}
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
                pagination={{
                    total: data?.total,
                    showTotal: (total) => `Total ${total}`,
                    defaultPageSize: 50
                }}
                rowKey={(row) => row?.id}
                onChange={handleChangePage}
                rowSelection
                loading={loading}
                columns={columns}
                size="small"
                dataSource={data?.result}
            />
        </>
    );
};

function Mails() {
    const [pageProperty, setPageProperty] = useState({
        limit: 50,
        offset: 0
    });

    const { data, isLoading } = useQuery(
        ["mails", "inbox"],
        () =>
            getMail({
                type: "inbox",
                limit: pageProperty?.limit,
                offset: pageProperty?.offset
            }),
        {
            enabled: !!pageProperty
        }
    );

    const handleChangePage = (page, pageSize) => {
        setPageProperty({
            ...pageProperty,
            offset: page * pageSize - pageProperty?.limit
        });
    };

    return (
        <MailTable
            data={data}
            handleChangePage={handleChangePage}
            loading={isLoading}
        />
    );
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
