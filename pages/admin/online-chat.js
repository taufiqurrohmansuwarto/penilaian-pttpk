import { Button, Input, Modal, Table } from "antd";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { createGroupChats, getGroupsChats } from "../../services/main.services";
import AdminLayout from "../../src/components/AdminLayout";
import PageContainer from "../../src/components/PageContainer";

function CreateModal({ visible, onCancel }) {
    const [groupName, setGroupName] = useState();
    const queryClient = useQueryClient();

    const { mutate: create } = useMutation((data) => createGroupChats(data), {
        onSuccess: () => {
            setGroupName("");
            onCancel();
            queryClient.invalidateQueries(["group-chats"]);
        }
    });

    const handleCreate = () => {
        const data = { name: groupName };
        create(data);
    };

    return (
        <Modal
            destroyOnClose
            title="Create"
            visible={visible}
            onCancel={onCancel}
            onOk={handleCreate}
        >
            <Input
                value={groupName}
                onChange={(e) => setGroupName(e?.target?.value)}
            />
        </Modal>
    );
}

function OnlineChat() {
    const { data: user } = useSession();
    const { data, isLoading } = useQuery(["group-chats"], () =>
        getGroupsChats()
    );

    const [visibleCreate, setVisibleCreate] = useState("");
    const showCreate = () => setVisibleCreate(true);
    const cancelCreate = () => setVisibleCreate(false);

    const [visibleUpdate, setVisbileUpdate] = useState("");
    const showUpdate = () => setVisbileUpdate(true);
    const cancelUpdate = () => setVisbileUpdate(false);

    const handleRemove = (id) => {};

    const columns = [
        { title: "name", key: "name", dataIndex: "name" },
        {
            title: "Aksi",
            key: "aksi",
            render: (_, row) => (
                <Button onClick={() => handleRemove(row?.id)}>Hapus</Button>
            )
        }
    ];

    return (
        <PageContainer title="Online Chat" style={{ minHeight: "95vh" }}>
            <Table
                loading={isLoading}
                pagination={false}
                columns={columns}
                dataSource={data}
                rowKey={(row) => row?.id}
            />
            <CreateModal visible={visibleCreate} onCancel={cancelCreate} />
            <Button style={{ marginTop: 10 }} onClick={showCreate}>
                Create Group Chat
            </Button>
        </PageContainer>
    );
}

OnlineChat.Auth = {
    isAdmin: true
};

OnlineChat.getLayout = function getLayout(page) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default OnlineChat;
