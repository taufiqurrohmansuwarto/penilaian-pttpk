import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Space } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const buttons = [
    {
        name: "Self Sign",
        path: "/esign/uploads/self-sign/upload",
        disabled: false
    },
    {
        name: "Sign And Request",
        path: "/esign/uploads/sign-and-share/upload",
        disabled: true
    },
    {
        name: "Request From Others",
        path: "/esign/uploads/share-only/upload",
        disabled: false
    }
];

function ButtonCreate() {
    const [visible, setVisible] = useState(false);
    const router = useRouter();

    const showModal = () => {
        setVisible(true);
    };

    const gotoPath = (path) => {
        router.push(path);
        setVisible(false);
    };

    return (
        <>
            <Modal
                centered
                title="Choose document workflow"
                footer={null}
                onCancel={() => setVisible(false)}
                visible={visible}
            >
                <Space>
                    {buttons?.map((b) => (
                        <Button
                            disabled={b?.disabled}
                            onClick={() => gotoPath(b?.path)}
                        >
                            {b?.name}
                        </Button>
                    ))}
                </Space>
            </Modal>
            <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={showModal}
            ></Button>
        </>
    );
}

export default ButtonCreate;
