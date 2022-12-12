import Link from "@tiptap/extension-link";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button, Card, Form, Input, message, Modal, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
    createAnnouncement,
    getAnnouncements,
    updateAnnouncement
} from "../../../services/admin.service";
import AdminLayout from "../../../src/components/AdminLayout";
import CustomRichEditorBiasa from "../../../src/components/CustomRichEditorBiasa";
import PageContainer from "../../../src/components/PageContainer";
import RichTextEditor from "../../../src/components/RichTextEditor";

const ModalPengumuman = ({ visible, onCancel }) => {
    const [text, setText] = useState();
    const [title, setTitle] = useState();

    const client = useQueryClient();
    const { mutate: create } = useMutation((data) => createAnnouncement(data), {
        onSuccess: () => {
            client.invalidateQueries(["announcements"]);
            setText("");
            setTitle("");
            onCancel();
        }
    });

    const handleSubmit = () => {
        const data = {
            title: title,
            description: text
        };
        create(data);
    };

    return (
        <Modal
            destroyOnClose
            width={800}
            visible={visible}
            onCancel={onCancel}
            title="Buat Pengumuman"
            centered
            onOk={handleSubmit}
        >
            <Input
                value={title}
                onChange={(e) => setTitle(e?.target?.value)}
                style={{ marginBottom: 10 }}
            />
            <RichTextEditor
                style={{ minHeight: 400 }}
                value={text}
                onChange={setText}
            />
        </Modal>
    );
};

const EditPengumuman = ({ visible, onCancel, data }) => {
    const [form] = Form.useForm();

    const editor = useEditor({
        content: "",
        extensions: [StarterKit, Link]
    });

    useEffect(() => {
        form.setFieldsValue({
            title: data?.title,
            description: data?.description
        });
        if (editor) {
            editor?.commands?.setContent(data?.description);
        }
    }, [data, form, editor]);

    const client = useQueryClient();

    const { mutate: update, isLoading } = useMutation(
        (data) => updateAnnouncement(data),
        {
            onSuccess: () => {
                client.invalidateQueries(["announcements"]);
                onCancel();
                message.success("Berhasil mengubah pengumuman");
            }
        }
    );

    const handleUpdate = async () => {
        const values = await form.validateFields();
        const description = editor?.getHTML();
        update({
            id: data?.id,
            data: {
                title: values?.title,
                description
            }
        });
    };

    return (
        <Modal
            centered
            visible={visible}
            confirmLoading={isLoading}
            width={900}
            onCancel={onCancel}
            onOk={handleUpdate}
            title="Edit Pengumuman"
        >
            <Form form={form}>
                <Form.Item name="title">
                    <Input style={{ marginBottom: 10 }} />
                </Form.Item>
                <Form.Item name="description">
                    <CustomRichEditorBiasa editor={editor} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

function Announcements() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setUpdateModal] = useState(false);

    const openCreateModal = () => setShowCreateModal(true);
    const closeCreateModal = () => setShowCreateModal(false);

    const openUpdateModal = () => setUpdateModal(true);
    const closeUpdateModal = () => setUpdateModal(false);

    const { data, isLoading } = useQuery(["announcements"], () =>
        getAnnouncements()
    );

    return (
        <PageContainer style={{ minHeight: "95vh" }}>
            <ModalPengumuman
                onCancel={closeCreateModal}
                visible={showCreateModal}
            />
            <EditPengumuman
                onCancel={closeUpdateModal}
                visible={showUpdateModal}
                data={data}
            />

            <Skeleton loading={isLoading}>
                <Card>
                    {data ? (
                        <div>
                            <p>{data?.title}</p>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: data?.description
                                }}
                            />
                            <Button
                                style={{ marginTop: 10 }}
                                onClick={openUpdateModal}
                                type="primary"
                            >
                                Ubah Pengumuman
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <Button type="primary" onClick={openCreateModal}>
                                Buat Pengumuman
                            </Button>
                        </div>
                    )}
                </Card>
            </Skeleton>
        </PageContainer>
    );
}

Announcements.Auth = {
    isAdmin: true
};

Announcements.getLayout = function getLayout(page) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default Announcements;
