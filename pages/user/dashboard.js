import { Button, Card, Divider } from "antd";
import { useRouter } from "next/router";
import RichTextEditor from "../../src/components/RichTextEditor";
import UserLayout from "../../src/components/UserLayout";
import UserComments from "../../src/components/UsersComments";
import { useState } from "react";

const Dashboard = () => {
    const router = useRouter();

    const gotoPenilaian = () => {
        router.push("/user/penilaian");
    };

    const gotoBulanan = () => {
        router.push("/user/penilaian/bulanan");
    };

    const [message, setMessage] = useState(null);

    const handleShowMessage = () => {
        console.log(message);
    };

    return (
        <>
            <RichTextEditor value={message} onChange={setMessage} />
            <Button onClick={handleShowMessage} type="primary">
                Submit
            </Button>
            <Divider />
            <Button onClick={gotoPenilaian}>hello world</Button>
            <Button onClick={gotoBulanan}>Bulanan</Button>
            <UserComments />
        </>
    );
};

Dashboard.Auth = {
    roles: ["USER"],
    groups: ["PTTPK"]
};

export default Dashboard;
