import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import { getRefSatuanKinerja } from "../../../../services/ref.service";
import { detailPenilaian } from "../../../../services/users.service";

const CreateTarget = () => {};

const DetailPenilaian = () => {
  const {
    query: { id },
  } = useRouter();

  const [visible, setVisible] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);

  const [form] = Form.useForm();

  const onClose = () => setVisible(false);
  const showDrawer = () => setVisible(true);

  const onCloseEdit = () => setVisibleEdit(false);
  const showDrawerEdit = () => setVisibleEdit(true);

  const { data } = useQuery(["penilaian", id], () => detailPenilaian(id), {
    enabled: !!id,
  });

  const { data: dataRefSatuanKinerja } = useQuery("refSatuanKinerja", () =>
    getRefSatuanKinerja()
  );

  const handleSubmitCreate = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);
    } catch (error) {}
  };

  return (
    <div>
      {dataRefSatuanKinerja && (
        <>
          <Drawer
            onClose={onClose}
            visible={visible}
            title="Buat Target Penilaian"
            width={720}
            extra={[
              <Button onClick={handleSubmitCreate} type="primary">
                Submit
              </Button>,
            ]}
          >
            <Form form={form} layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="pekerjaan"
                    label="Pekerjaan"
                    rules={[
                      {
                        required: true,
                        message: "Pekerjaan Tidak boleh kosong",
                      },
                    ]}
                  >
                    <Input placeholder="Masukkan target pekerjaan" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="kuantitas"
                    label="Kuantitas"
                    help="Jumlah Satuan"
                    rules={[
                      { required: true, message: "Please select an owner" },
                    ]}
                  >
                    <InputNumber style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="ref_satuan_kinerja_id"
                    label="Satuan"
                    rules={[
                      { required: true, message: "Satuan Tidak boleh kosong" },
                    ]}
                  >
                    <Select placeholder="Please choose the type">
                      {dataRefSatuanKinerja?.map((d) => (
                        <Select.Option key={d?.id}>{d?.nama}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Drawer>

          <Drawer
            onClose={onCloseEdit}
            title="Edit Target Penilaian"
            visible={visibleEdit}
          ></Drawer>

          <Button onClick={showDrawer}>Create</Button>
        </>
      )}
    </div>
  );
};

DetailPenilaian.Auth = {
  roles: ["USER"],
  groups: ["PTTPK"],
};

export default DetailPenilaian;
