import SelfSignUploadLayout from "../../../../src/components/esign/SelfSignUploadLayout";
import UploadDocument from "../../../../src/components/esign/UploadDocument";
import EsignLayout from "../../../../src/components/Layout/EsignLayout";

const UploadSelfSign = () => {
    return (
        <SelfSignUploadLayout>
            <UploadDocument type="selfSign" />
        </SelfSignUploadLayout>
    );
};

UploadSelfSign.Auth = {
    roles: ["USER"],
    groups: ["MASTER"]
};

UploadSelfSign.getLayout = function layout(page) {
    return <EsignLayout>{page}</EsignLayout>;
};

export default UploadSelfSign;
