import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from "next-auth/react";

import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
export default function TestLogin() {
  const { data: session } = useSession();
  useEffect(() => {
    console.log("Session:", session);
  }, [session]);
    
  const router = useRouter();
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/servicesView");
  }
  if(session){
    return (
      <main
        className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
      >
        <button onClick={handleClick}>
          ServicesView
        </button>
      </main>
    );
  } else {
    return (
      <>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
      </>
    )
  }
}
