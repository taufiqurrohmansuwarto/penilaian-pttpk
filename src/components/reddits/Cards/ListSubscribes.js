import { List, Card, Avatar } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { getListSubscribers } from "../../../../services/main.services";

function ListSubscribes() {
    const { data } = useSession();
    const router = useRouter();

    const { data: dataSubscribes, isLoading } = useQuery(
        ["list-subscribes"],
        () => getListSubscribers(),
        {
            enabled: !!data?.user?.id
        }
    );

    const gotoSub = (title) => {
        router.push(`/discussions/r/${title}`);
    };

    return (
        <Card title="Komunitas ku" size="small">
            <List
                size="small"
                dataSource={dataSubscribes}
                loading={isLoading}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar />}
                            title={
                                <>
                                    <div
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            gotoSub(item?.discussion?.title)
                                        }
                                    >
                                        #{item?.discussion?.title}
                                    </div>
                                </>
                            }
                            description={item?.discussion?.content}
                        />
                    </List.Item>
                )}
            />
        </Card>
    );
}

export default ListSubscribes;
