import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    CommentOutlined
} from "@ant-design/icons";
import { Comment, Typography } from "antd";

const data = {
    avatar: "https://master.bkd.jatimprov.go.id/files_jatimprov/56543-file_foto-20190720-969-DSC_0443.JPG",
    date: new Date(),
    name: "Iput Taufiqurrohman Suwarto",
    title: `<p>&nbsp;<strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.&nbsp;</p>`
};

const CardPostNew = () => {
    return (
        <Comment
            avatar={data?.avatar}
            author={data?.name}
            datetime={"2020-02-02"}
            content={
                <>
                    <Typography.Title level={4}>Test</Typography.Title>
                    <div dangerouslySetInnerHTML={{ __html: data?.title }} />
                </>
            }
            actions={[
                <span>
                    <ArrowUpOutlined />
                </span>,
                <span>
                    <ArrowDownOutlined />
                </span>,
                <span>
                    <CommentOutlined />
                </span>
            ]}
        />
    );
};

export default CardPostNew;
