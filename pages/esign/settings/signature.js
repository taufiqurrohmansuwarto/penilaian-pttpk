import EsignSettingsLayout from "../../../src/components/esign/SettingLayout";
import PageContainer from "../../../src/components/PageContainer";
import { useQuery } from "react-query";
import { getStamps } from "../../../services/esign.service";
import { Card, Skeleton } from "antd";

function Signature() {
    const { data, isLoading } = useQuery(["stamps"], () => getStamps());
    return (
        <PageContainer title="Signature">
            <Skeleton loading={isLoading}>
                <img src={`data:image/jpeg;base64,${data}`} />
            </Skeleton>
        </PageContainer>
    );
}

// should be have some scope from oidc
Signature.Auth = {
    roles: ["USER"],
    groups: ["MASTER"]
};

Signature.getLayout = function getLayout(page) {
    return <EsignSettingsLayout>{page}</EsignSettingsLayout>;
};

export default Signature;
