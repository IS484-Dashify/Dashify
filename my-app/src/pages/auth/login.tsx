import { Inter } from "next/font/google";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next"
import { signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]"
import { Login } from  "../../../public/svgs"
import { SlSocialGoogle } from "react-icons/sl";
import Image from "next/image"

const inter = Inter({ subsets: ["latin"] });

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return(
    <main>
      <div className="h-screen px-14 pt-6">
        <div id="login-div" className="flex flex-col text-center justify-center items-center h-full">
          <div className="shadow-md w-2/5 h-3/4 relative rounded-xl">
            <div className="flex items-start justify-center border rounded-t-xl bg-blue-500 w-full h-2/3 p-10">
              <Image src="/logo(white).png" alt="" width={400} height={400} />
            </div>
            <div className="h-1/3 w-full bg-white rounded-b-xl"></div>
            </div>
          </div>
          <div className="h-1/5 w-1/5 bg-white absolute  shadow-md rounded-xl"></div>
        </div>
          {/* <div className="flex flex-col">
              <h1 className='text-2xl font-bold text-indigo-d-500 mb-1'>Dashify</h1>
              <p>Welcome back to Dashify!</p>
              <div className="-mt-4 mb-4">
                <div className="mx-auto">
                  <Login/>
                </div>
              </div>
              <div className="mx-auto">
                <button
                  className="h-[2.5rem] text-xl bg-indigo-d-500  px-4 text-[#F2F3F4] border-1 rounded border-indigo-d-500 shadow-md shadow-transparent hover:shadow-slate-500/45 transition-all duration-300 ease-soft-spring flex items-center align-middle" 
                  onClick={() => signIn("google")}
                >
                  <SlSocialGoogle className="inline mr-2" size="20"/>
                  Log In
                </button>
              </div>
            </div> */}
        
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