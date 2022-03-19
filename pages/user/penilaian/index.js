import { Button } from "antd";
import { useRouter } from "next/router";

const Penilaian = () => {
  const createPenilaian = () => router.push("/user/penilaian/create");
  const router = useRouter();

  return (
    <div>
      <Button onClick={createPenilaian}>Buat</Button>
    </div>
  );
};

Penilaian.Auth = {
  roles: ["USER"],
  groups: ["PTTPK"],
};

export default Penilaian;
