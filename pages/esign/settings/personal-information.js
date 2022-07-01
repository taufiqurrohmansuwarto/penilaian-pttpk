import EsignSettingsLayout from "../../../src/components/esign/SettingLayout";
import PageContainer from "../../../src/components/PageContainer";
import { useSession } from "next-auth/react";
import { Card, Descriptions, Skeleton } from "antd";

function PersonalInformation() {
    const {
        data: { user },
        status
    } = useSession();

    return (
        <PageContainer title="Personal Information">
            <Skeleton loading={status === "loading"}>
                <Card>
                    <Descriptions title="User Info">
                        <Descriptions.Item label="Nama">
                            {user?.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="NIP">
                            {user?.employee_number}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </Skeleton>
        </PageContainer>
    );
}

PersonalInformation.Auth = {
    roles: ["USER"],
    groups: ["MASTER"]
};

PersonalInformation.getLayout = function getLayout(page) {
    return <EsignSettingsLayout>{page}</EsignSettingsLayout>;
};

export default PersonalInformation;
