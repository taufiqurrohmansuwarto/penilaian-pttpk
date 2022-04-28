import { Button, Card } from "antd";
import { useMutation, useQueryClient } from "react-query";
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
            {/* {JSON.stringify(id)} */}
            <Button onClick={handleSubscribe} type="primary">
                {data?.discussions_subscribes?.length
                    ? "Unsubscribe"
                    : "Subscribe"}
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
