import { Inter } from "next/font/google";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next"
import { signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]"
import { Login } from  "../components/svgs"
import { SlSocialGoogle } from "react-icons/sl";

const inter = Inter({ subsets: ["latin"] });

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return(
    <main>
      <div className="h-screen px-14 pt-6">
        <div id="login-div" className="flex text-center justify-center items-center h-full">
          <div className="flex justify-between items-end border rounded bg-lavender-200/50 px-6 py-12">
            <div className="flex flex-col">
              <h1 className='text-2xl font-bold text-indigo-d-500 mb-1'>Dashify</h1>
              <p>Welcome back to Dashify!</p>
              <div className="-mt-4 mb-4">
                {/* <h1 className='text-4xl font-bold text-text mb-4'>Log In</h1> */}
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