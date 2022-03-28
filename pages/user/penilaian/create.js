import { Button, Form, InputNumber, message, Select, TreeSelect } from "antd";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import {
  buatPenilaian,
  getJabatan,
  getUnor,
} from "../../../services/users.service";

const CreatePenilaian = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  const { data: dataJabatan, isLoading: isLoadingJabatan } = useQuery(
    ["jabatan"],
    () => getJabatan()
  );
  const { data: dataUnor, isLoading: isloadingUnor } = useQuery(["unor"], () =>
    getUnor()
  );

  const createPenilaianMutation = useMutation((data) => buatPenilaian(data), {
    onError: (error) => {
      console.log(error);
    },
    onSuccess: () => {
      message.success("Penilaian Berhasil ditambahkan");
      router.push("/user/penilaian");
    },
  });

  const onFinish = (values) => {
    createPenilaianMutation.mutate(values);
  };

  return (
    <div>
      {dataJabatan && dataUnor && (
        <Form form={form} onFinish={onFinish}>
          {JSON.stringify(dataJabatan)}
          <Form.Item name="tahun" label="Tahun">
            <InputNumber />
          </Form.Item>
          <Form.Item
            help="Data diambil dari aplikasi pttpk dengan jabatan yang tidak kosong"
            name="id_jabatan"
            label="Jabatan"
          >
            <Select>
              {dataJabatan?.map((d) => (
                <Select.Option values={d?.id} key={d?.id}>
                  {d?.nama} - ({d?.tgl_aktif})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="id_skpd" label="Unit Kerja">
            <TreeSelect
              showSearch
              treeNodeFilterProp="title"
              treeData={dataUnor}
            />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

CreatePenilaian.Auth = {
  roles: ["USER"],
  groups: ["PTTPK"],
};

export default CreatePenilaian;