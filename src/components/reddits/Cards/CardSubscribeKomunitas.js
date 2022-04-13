import { useRouter } from "next/router";
import { useEffect } from "react";
import React from "react";
import { useMutation } from "react-query";

function CardSubscribeKomunitas() {
    const router = useRouter();

    useEffect(() => {
        if (!router.isReady) return;
    }, [router?.query]);

    const subscribeMutation = useMutation();
    const unsubscribeMutation = useMutation();

    return (
        <Card>
            <Button>Subscribe</Button>
            <Button>Unsubcribe</Button>
        </Card>
    );
}

export default CardSubscribeKomunitas;
