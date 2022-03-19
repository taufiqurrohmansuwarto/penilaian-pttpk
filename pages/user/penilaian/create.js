import { Form } from "antd";

const CreatePenilaian = () => {
  const [form] = Form.useForm();

  return <div>Hello world</div>;
};

CreatePenilaian.Auth = {
  roles: ["USER"],
  groups: ["PTTPK"],
};

export default CreatePenilaian;
