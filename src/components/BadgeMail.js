import { MailOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import { useQuery } from "react-query";

function BadgeMail() {
    // const { data, isLoading } = useQuery(["mails-count-notification"]);

    return (
        <Badge size="small" dot={1}>
            <MailOutlined />
        </Badge>
    );
}

export default BadgeMail;
