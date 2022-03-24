import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { status, data } = useSession({
    required: true,
    onUnauthenticated: () => signIn(),
  });

  if (
    status === "authenticated" &&
    data?.user?.role === "USER" &&
    data?.user?.group === "PTTPK"
  ) {
    router.push("/user/dashboard");
  } else if (
    status === "authenticated" &&
    data?.user?.role === "FASILITATOR" &&
    data?.user?.group === "PTTPK"
  ) {
    router.push("/fasilitator/dashboard");
  } else if (
    status === "authenticated" &&
    data?.user?.role === "USER" &&
    data?.user?.group === "MASTER"
  ) {
    router.push("/approval/dashboard");
  }

  return null;
}
