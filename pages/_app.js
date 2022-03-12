import { useState } from "react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import "semantic-ui-css/semantic.min.css";
import "../styles/global.css";

export default function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps?.dehydrateState}>
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  );
}
