import { Inter } from "next/font/google";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next"
import { signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]"
import { SlSocialGoogle } from "react-icons/sl";
import Image from "next/image"

const inter = Inter({ subsets: ["latin"] });

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return(
    <main>
      <div className="h-screen px-14">
        <div id="login-div" className="flex text-center justify-center items-center h-full">
          <div className="flex justify-between items-end px-24 py-12">
            <div className="flex flex-col -mt-32">
              {/* <h4 className='text-2xl text-text mb-1'>Welcome Back!</h4> */}
              <div className="mt-4 mb-7">
                <div className="flex justify-center align-center">
                  <div>
                    <Image src="/logo.png" alt="" width={150} height={150} />
                  </div>
                  <div className="my-auto ml-2">
                    <h1 className='text-8xl italic text-indigo-d-500 mb-1'>Dashify</h1>
                  </div>
                </div>
              </div>
              <div className="mx-auto w-full">
                <button
                  className="h-[2.5rem] w-full bg-indigo-d-500 text-[#F2F3F4] text-xl border-1 rounded border-indigo-d-500 shadow-md shadow-transparent hover:shadow-slate-500/45 transition-all duration-300 ease-soft-spring flex items-center align-middle justify-center" 
                  onClick={() => signIn("google")}
                >
                  <SlSocialGoogle className="inline mr-2" size="23"/>
                  Log In
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </main>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } }
  }

  return {
    props: {
      "providers" : []
    }
  };
}