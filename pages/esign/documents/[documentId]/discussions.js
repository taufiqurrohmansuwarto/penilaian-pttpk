import { useRouter } from "next/router";
import React from "react";
import DetailDocumentLayout from "../../../../src/components/esign/DocumentDetailLayout";
import { getSession } from "next-auth/react";

function Discusisons({ data }) {
    const router = useRouter();

    const {
        query: { documentId }
    } = router;

    return <DetailDocumentLayout>{JSON.stringify(data)}</DetailDocumentLayout>;
}

Discusisons.Auth = {
    roles: ["USER"],
    groups: ["MASTER"]
};

export const getServerSideProps = async (ctx) => {
    const { documentId } = ctx?.params;
    const session = await getSession(ctx);
    const url = process.env.RESOURCE_PROTECTED_URL;

    const data = await fetch(`${url}/esign/documents/${documentId}/details`, {
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    });

    const result = await data?.json();

    return {
        props: {
            data: result
        }
    };
};

export default Discusisons;
