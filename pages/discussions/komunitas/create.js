import Layout from "../../../src/components/Layout";
import { Card, Form } from "antd";

const CreateKomunitas = () => {
    // fetch some topics eg : hobbies, dsb

    // ada name (ndak boleh pakai spasi), topics, description
    const [form] = Form.useForm();

    return (
        <Layout title="Buat Komunitas">
            <Card>
                <Form></Form>
            </Card>
        </Layout>
    );
};

CreateKomunitas.auth = {
    roles: ["USER", "FASILITATOR"],
    groups: ["MASTER", "PTTPK"]
};

export default CreateKomunitas;
