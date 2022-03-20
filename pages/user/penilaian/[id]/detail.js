import { Button, Drawer } from "antd";
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

  return (
    <div>
      <Drawer
        onClose={onClose}
        visible={visible}
        title="Buat Target Penilaian"
        width={720}
      ></Drawer>
      <Button onClick={showDrawer}>Create</Button>
    </div>
  );
};

export default DetailPenilaian;
