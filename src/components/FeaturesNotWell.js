import { Alert } from "antd";

function FeaturesNotWell() {
    return (
        <Alert
            message="Perhatian"
            description="Fitur masih dalam tahap pengembangan. Percakapan akan dihapus dalam waktu dekat. "
            type="warning"
            showIcon
        />
    );
}

export default FeaturesNotWell;
