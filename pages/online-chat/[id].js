import { Avatar, Box, Divider, Group, ScrollArea, Text } from "@mantine/core";
import { Button, Input } from "antd";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getChats, sendChats } from "../../services/main.services";
import Layout from "../../src/components/Layout";
import PageContainer from "../../src/components/PageContainer";
import moment from "moment";
import CustomRichTextEditor from "../../src/components/CustomRichTextEditor";

const Index = () => {
    const router = useRouter();
    const [message, setMessage] = useState(null);
    const { data, isLoading } = useQuery(
        ["chats", router?.query?.id],
        () => getChats(router?.query?.id),
        {
            enabled: !!router?.query?.id,
            refetchInterval: 1000,
            refetchIntervalInBackground: true
        }
    );

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [data]);

    const queryClient = useQueryClient();

    const { mutate: create } = useMutation((data) => sendChats(data), {
        onSuccess: () => {
            setMessage("");
            queryClient.invalidateQueries(["chats", router?.query?.id]);
        },
        onError: () => {
            alert("error");
        }
    });

    const handleSubmit = () => {
        if (!message?.trim()) {
            return;
        } else {
            const data = {
                id: router?.query?.id,
                data: {
                    message
                }
            };

            create(data);
        }
    };

    return (
        <>
            {/* <ScrollArea style={{ height: "50vh" }}>
                {data?.map((d) => (
                    <Box>
                        <Group>
                            <Avatar
                                size="md"
                                radius="xs"
                                src={d?.user?.image}
                            />

                            <Box sx={{ flex: 1, alignItems: "start" }}>
                                <Text size="xs">{d?.user?.username}</Text>
                                <Text size="xs">
                                    {moment(d?.created_at).format(
                                        "dddd, HH:mm"
                                    )}
                                </Text>
                            </Box>
                        </Group>
                        <Text mt="md" size="sm">
                            {d?.message}
                        </Text>
                        <Divider my="md" />
                    </Box>
                ))}
                <div ref={messagesEndRef}></div>
            </ScrollArea> */}
            <CustomRichTextEditor
                text={message}
                setText={setMessage}
                handleSubmit={handleSubmit}
            />
        </>
    );
};

Index.Auth = {
    roles: ["USER", "FASILITATOR", "ADMIN"],
    groups: ["PTTPK", "MASTER"]
};

Index.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default Index;