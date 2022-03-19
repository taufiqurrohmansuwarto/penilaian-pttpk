import { Button } from "antd";
import { signOut } from "next-auth/react";

const Dashboard = () => {
  return (
    <div>
      Dashboard fasilitator
      <Button onClick={signOut}>hello world</Button>
    </div>
  );
};

export default Dashboard;
