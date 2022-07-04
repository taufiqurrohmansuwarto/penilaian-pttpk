import { Card, Steps } from "antd";
import PageContainer from "../PageContainer";

const StepSelfSign = ({ step = 0 }) => {
    return (
        <div style={{ padding: 10, marginBottom: 16, marginTop: 16 }}>
            <Steps size="small" current={step}>
                <Steps.Step title="Upload Document" />
                <Steps.Step title="Place Signature" />
                <Steps.Step title="Finish" />
            </Steps>
        </div>
    );
};

function SelfSignUploadLayout({ step = 0, children }) {
    return (
        <>
            <PageContainer subTitle="Workflow" fixedHeader title="Self Sign" />
            <StepSelfSign step={step} />
            <Card>{children}</Card>
        </>
    );
}

export default SelfSignUploadLayout;
