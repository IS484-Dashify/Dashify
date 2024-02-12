import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from "next-auth/react";

import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
export default function Home() {
  const { data: session } = useSession();
  useEffect(() => {
    console.log("Session:", session);
  }, [session]);

  const router = useRouter();
  if(session){
    return(
      <main
        className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
      >
        Template Page, you are logged in
      </main>)
  } else {
    return(
      <>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
      </>
    )
  }
}
