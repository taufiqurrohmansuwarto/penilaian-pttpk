import { Alert } from "@mantine/core";
import { Card, Divider, Radio, Space, Typography } from "antd";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Speakerphone } from "tabler-icons-react";
import { answerPooling, getUserPooling } from "../../../services/main.services";

const Poll = ({ pool }) => {
    const pooling =
        pool?.pollings_user_answer?.length === 0
            ? null
            : pool?.pollings_user_answer?.[0]?.pooling_answer_id;
    const [value, setValue] = useState(pooling);

    const queryClient = useQueryClient();

    const { mutateAsync: answer } = useMutation((data) => answerPooling(data), {
        onError: (error) => console.log(error),
        onSuccess: () => queryClient.invalidateQueries(["users-poolings"])
    });

    const handleChange = async (e) => {
        const id = e?.target?.value;
        const data = { answerId: id, poolingId: pool?.id };
        await answer(data);
        setValue(id);
    };

    return (
        <div>
            <div style={{ marginBottom: 8 }}>
                <Typography.Text>{pool.title}</Typography.Text>
            </div>
            <Radio.Group value={value} onChange={handleChange}>
                <Space direction="vertical">
                    {pool?.poolings_answers?.map((p) => (
                        <Radio value={p?.id} key={p?.id}>
                            {p?.answer} ({p?._count?.pollings_user_answer}{" "}
                            orang)
                        </Radio>
                    ))}
                </Space>
            </Radio.Group>
            <Divider />
        </div>
    );
};

function PoolingsCard() {
    const { data, isLoading } = useQuery(["users-poolings"], () =>
        getUserPooling()
    );

    return (
        <>
            {data?.length ? (
                <Card
                    loading={isLoading}
                    title={
                        <Alert title="Voting" icon={<Speakerphone />}>
                            Dengan voting kamu bisa membantu developer
                            menjadikan aplikasi lebih baik
                        </Alert>
                    }
                >
                    {data?.map((d) => (
                        <Poll key={d?.id} pool={d} />
                    ))}
                </Card>
            ) : null}
        </>
    );
}

export default PoolingsCard;
