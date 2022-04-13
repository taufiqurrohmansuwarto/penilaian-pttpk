import { Button, Card } from "antd";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
    getSubscribe,
    subscribePost,
    unsubscribePost
} from "../../../../services/main.services";

function CardSubscribePosts({ id, title }) {
    const { data: dataSubscribe } = useQuery(
        ["subscribe", id],
        () => getSubscribe(id),
        {
            enabled: !!id
        }
    );

    const queryClient = useQueryClient();
    const subscribeMutation = useMutation((id) => subscribePost(id), {
        onSuccess: () => {
            queryClient.invalidateQueries(["subscribe", id]);
            queryClient.invalidateQueries(["list-subscribes"]);
        }
    });
    const unsubscribeMutation = useMutation((id) => unsubscribePost(id), {
        onSuccess: () => {
            queryClient.invalidateQueries(["subscribe", id]);
            queryClient.invalidateQueries(["list-subscribes"]);
        }
    });

    const handleSubscribe = () => {
        subscribeMutation.mutate(id);
    };
    const handleUnsubscribe = () => {
        unsubscribeMutation.mutate(id);
    };

    return (
        <Card>
            {dataSubscribe ? (
                <Button
                    block
                    loading={unsubscribeMutation.isLoading}
                    onClick={handleUnsubscribe}
                >
                    Batal Gabung
                </Button>
            ) : (
                <Button
                    type="primary"
                    block
                    loading={subscribeMutation.isLoading}
                    onClick={handleSubscribe}
                >
                    Gabung
                </Button>
            )}
        </Card>
    );
}

export default CardSubscribePosts;
