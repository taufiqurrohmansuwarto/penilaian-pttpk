import { Button } from "antd";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { status, data } = useSession({
    required: true,
    onUnauthenticated: () => signIn(),
  });

  return (
    <div>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Beatae id
        voluptatibus nostrum molestias, recusandae, placeat quae doloribus
        labore quidem, sint minima itaque voluptates vero? Minima ab obcaecati
        aliquid quo iusto.
      </p>
      <Button>hello</Button>
    </div>
  );
}
