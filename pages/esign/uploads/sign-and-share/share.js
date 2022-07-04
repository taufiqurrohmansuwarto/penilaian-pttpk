import EsignLayout from "../../../../src/components/Layout/EsignLayout";

const Sign = () => {
    return <div>hello world</div>;
};

Sign.Auth = {
    roles: ["USER"],
    groups: ["MASTER"]
};

Sign.getLayout = function layout(page) {
    return <EsignLayout>{page}</EsignLayout>;
};

export default Sign;
