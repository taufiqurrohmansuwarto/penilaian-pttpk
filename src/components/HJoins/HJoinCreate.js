import { Form, Input } from "antd";
import React from "react";

const lokasi = ["BKD Jatim"];

function HJoinCreate() {
    const [form] = Form.useForm();

    return (
        <Form>
            <Form.Item>
                <Input />
            </Form.Item>
            <Form.Item>
                <Input.TextArea />
            </Form.Item>
            <Form.Item></Form.Item>
        </Form>
    );
}

export default HJoinCreate;
