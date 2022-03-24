import { Button } from "antd";
import { signOut } from "next-auth/react";

const Dashboard = () => {
  return (
    <div>
      <Button onClick={signOut}>Hello world</Button>
    </div>
  );
};

export default Dashboard;
