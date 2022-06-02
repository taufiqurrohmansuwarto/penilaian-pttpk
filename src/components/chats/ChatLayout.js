import { Skeleton } from "antd";
import Link from "next/link";
import React from "react";
import { useQuery } from "react-query";
import { getGroupsChats } from "../../../services/main.services";

function ChatLayout() {
    const { data, isLoading } = useQuery(["groups-chats"], () =>
        getGroupsChats()
    );

    return (
        <div>
            <Skeleton loading={isLoading}>
                {data?.map((d) => (
                    <Link href={`/online-chat/${d?.id}`}>{d.name}</Link>
                ))}
            </Skeleton>
        </div>
    );
}

export default ChatLayout;
