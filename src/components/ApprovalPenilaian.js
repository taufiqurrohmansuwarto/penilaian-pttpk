import { Skeleton } from "antd";
import { useQuery } from "react-query";
import { getPenilaian } from "../../services/approval.service";

function ApprovalPenilaian() {
    const { data: dataPenilaian, isLoading: isLoadingPenilaian } = useQuery(
        "approval_penilaian",
        () => getPenilaian()
    );

    return (
        <Skeleton loading={isLoadingPenilaian}>
            {JSON.stringify(dataPenilaian)}
        </Skeleton>
    );
}

export default ApprovalPenilaian;
