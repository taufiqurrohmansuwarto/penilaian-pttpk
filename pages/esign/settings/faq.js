import EsignSettingsLayout from "../../../src/components/esign/SettingLayout";
import PageContainer from "../../../src/components/PageContainer";

function ActivityLogs() {
    return (
        <PageContainer title="Log Aktivitas">
            <div>ini adalah faq</div>
        </PageContainer>
    );
}

ActivityLogs.Auth = {
    roles: ["USER"],
    groups: ["MASTER"]
};

ActivityLogs.getLayout = function getLayout(page) {
    return <EsignSettingsLayout>{page}</EsignSettingsLayout>;
};

export default ActivityLogs;
