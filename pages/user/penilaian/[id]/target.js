import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { getRefSatuanKinerja } from "../../../../services/ref.service";

const TargetTahunan = () => {
  const {
    query: { id },
  } = useRouter();

  const { data: refSatuan } = useQuery("satuan", () => getRefSatuanKinerja(), {
    enabled: !!id,
  });

  return <div>{JSON.stringify(refSatuan)}</div>;
};

TargetTahunan.Auth = {
  roles: ["USER"],
  groups: ["PTTPK"],
};

export default TargetTahunan;
