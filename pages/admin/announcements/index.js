import { Button, Card, Input, Modal, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
    createAnnouncement,
    getAnnouncements,
    updateAnnouncement
} from "../../../services/admin.service";
import AdminLayout from "../../../src/components/AdminLayout";
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
    const [text, setText] = useState(data?.description);
    const [title, setTitle] = useState(data?.title);

    useEffect(() => {
        setText(data?.description);
        setTitle(data?.title);
    }, [data]);

    const client = useQueryClient();

    const { mutate: update } = useMutation((data) => updateAnnouncement(data), {
        onSuccess: () => {
            client.invalidateQueries(["announcements"]);
            setText("");
            setTitle("");
            onCancel();
        }
    });

    const handleUpdate = () => {
        update({
            id: data?.id,
            data: {
                title: title,
                description: text
            }
        });
    };

    return (
        <Modal
            visible={visible}
            width={800}
            onCancel={onCancel}
            onOk={handleUpdate}
            title="Edit Pengumuman"
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
                            >
                                Edit
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
