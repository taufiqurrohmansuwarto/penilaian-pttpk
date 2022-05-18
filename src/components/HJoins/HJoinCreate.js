import { InboxOutlined } from "@ant-design/icons";
import { AutoComplete, Form, Input, Select, Upload } from "antd";
import React from "react";

const options = [{ value: "BKD Jatim" }, { value: "Kominfo Jatim" }];

function HJoinCreate() {
    const [form] = Form.useForm();

    return (
        <Form form={form} layout="vertical">
            <Form.Item label="Lokasi">
                <AutoComplete
                    options={options}
                    filterOption={(inputValue, option) =>
                        option?.value
                            .toUpperCase()
                            .indexOf(inputValue.toUpperCase()) !== -1
                    }
                />
            </Form.Item>

            <Form.Item label="Judul">
                <Input />
            </Form.Item>
            <Form.Item label="Deskripsi">
                <Input.TextArea />
            </Form.Item>
            <Form.Item label="Kategori">
                <Select></Select>
            </Form.Item>
            <Form.Item label="Gambar">
                <Upload.Dragger accept="image/*">
                    <p>
                        <InboxOutlined />
                    </p>
                    <p>Click or drag file to this area to upload</p>
                    <p>Support for a single or bulk upload.</p>
                </Upload.Dragger>
            </Form.Item>
        </Form>
    );
}

export default HJoinCreate;
