import { Button } from "antd";
import { useRouter } from "next/router";

const Dashboard = () => {
  const router = useRouter();

  const gotoPenilaian = () => {
    router.push("/user/penilaian");
  };

  return (
    <div>
      Dashboard fasilitator
      <Button onClick={gotoPenilaian}>hello world</Button>
    </div>
  );
};

export default Dashboard;
