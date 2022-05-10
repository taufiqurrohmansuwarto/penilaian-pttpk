import { useDebouncedValue } from "@mantine/hooks";
import { Button, Form, Input, PageHeader, Select, Spin } from "antd";
import { isEmpty } from "lodash";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { findUsers } from "../../services/main.services";
import MailLayout from "../../src/components/CustomLayout/MaiLayout";
import Layout from "../../src/components/Layout";

const EmailForm = () => {
    const [nama, setNama] = useState("");
    const [debounceNama] = useDebouncedValue(nama, 500);

    const { data, isLoading } = useQuery(
        ["users", debounceNama],
        () => findUsers(debounceNama),
        {
            enabled: Boolean(debounceNama),
            refetchOnWindowFocus: false
        }
    );

    const [form] = Form.useForm();

    return (
        <Form form={form}>
            <Form.Item>
                <Select
                    showSearch
                    showArrow={false}
                    filterOption={false}
                    onSearch={(e) => setNama(e)}
                    allowClear
                    loading={isLoading}
                    defaultActiveFirstOption={false}
                    notFoundContent={isLoading ? <Spin size="small" /> : null}
                >
                    {data?.map((d) => (
                        <Select.Option value={d?.id} key={d?.id}>
                            {d?.value}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item></Form.Item>
            <Form.Item>
                <Button htmlType="submit">Submit</Button>
            </Form.Item>
        </Form>
    );
};

function Create() {
    return (
        <>
            <PageHeader title="test" subTitle="test" />
            <div>hello world</div>
            <EmailForm />
        </>
    );
}

Create.getLayout = function getLayout(page) {
    return (
        <Layout disableContentMargin={true}>
            <MailLayout>{page}</MailLayout>
        </Layout>
    );
};

Create.Auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["PTTPK", "MASTER"]
};

export default Create;
