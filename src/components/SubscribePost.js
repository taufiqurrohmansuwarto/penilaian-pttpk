import { Button } from "@mantine/core";
import { Card } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { Icon } from "semantic-ui-react";
import { subscribeDiscussion } from "../../services/main.services";

function SubscribePost({ data, id }) {
    const queryClient = useQueryClient();
    const subscribeMutation = useMutation((data) => subscribeDiscussion(data), {
        onSuccess: () => {
            queryClient.invalidateQueries("post");
        }
    });

    const handleSubscribe = () => {
        subscribeMutation.mutate(id);
    };

    return (
        <Card>
            <Button
                variant="default"
                onClick={handleSubscribe}
                leftIcon={
                    <Icon
                        name={
                            data?.discussions_subscribes?.length
                                ? "bell slash outline"
                                : "bell outline"
                        }
                    />
                }
            >
                {data?.discussions_subscribes?.length
                    ? "Batal Berlangganan"
                    : "Berlangganan"}
            </Button>
            <p>
                {data?.discussions_subscribes?.length
                    ? "Kamu menerima notifikasi untuk diskusi ini"
                    : "Kamu tidak menerima notifikasi untuk diskusi ini"}
            </p>
        </Card>
    );
}

export default SubscribePost;
