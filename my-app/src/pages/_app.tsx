import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {NextUIProvider} from "@nextui-org/react";
import {useRouter} from 'next/router'
import { SessionProvider } from "next-auth/react"

export default function App({ Component, pageProps:{ session, ...pageProps}}: AppProps) {
  
  const router = useRouter();

  return (
    <SessionProvider session={session}>

        <Component {...pageProps} />

    </SessionProvider>
  );
}
