import { MailOutlined } from "@ant-design/icons";
import { Badge, Tooltip } from "antd";

function BadgeMail() {
    return (
        <Badge size="small" dot={1}>
            <MailOutlined />
        </Badge>
    );
}

export default BadgeMail;
