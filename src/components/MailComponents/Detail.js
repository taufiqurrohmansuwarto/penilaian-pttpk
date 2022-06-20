import { Modal, Button, Divider, Form, Input, Skeleton } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { readMail, sendingEmail } from "../../../services/main.services";
import moment from "moment";
import RichTextEditor from "../RichTextEditor";

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
                    <RichTextEditor />
                </Form.Item>
            </Form>
        </Modal>
    );
};

function Detail({ inbox = false }) {
    const router = useRouter();

    // form modal
    const [visibility, setVisibility] = useState(false);

    const closeModal = () => setVisibility(false);

    const openModal = (row) => {
        setVisibility(true);
    };

    const { data, isLoading } = useQuery(
        ["email", router?.query?.id],
        () => readMail(router?.query?.id),
        {
            enabled: !!router?.query?.id
        }
    );

    useEffect(() => {}, [router?.query?.id]);

    return (
        <Skeleton loading={isLoading}>
            <FormModal
                userData={data}
                closeModal={closeModal}
                visibility={visibility}
            />
            <div>Pesan: </div>
            {moment(data?.date).format("lll")}
            <Divider />
            <div dangerouslySetInnerHTML={{ __html: data?.body }} />
            {inbox && (
                <div style={{ marginTop: 10 }}>
                    <Button onClick={openModal}>Balas</Button>
                </div>
            )}
        </Skeleton>
    );
}

export default Detail;
