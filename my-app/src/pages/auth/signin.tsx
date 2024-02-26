import { Inter } from "next/font/google";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next"
import { signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]"

const inter = Inter({ subsets: ["latin"] });

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return(
    <main>
      <div className="h-screen px-14 pt-6">
        <h1 className='text-4xl font-bold text-indigo-d-500 mt-1 pb-8 pt-2'>Dashify</h1>
          {/* <div className='flex justify-center items-center w-full'>
          </div> */}
        <div id="login-div" className="flex justify-center">
          <div className="flex flex-col justify-center">
            <div>
              <h1 className='text-4xl font-bold text-indigo-d-500 mt-1 pb-8 pt-2'>Login here</h1>
            </div>
            <div>
              <button
                className=""
                onClick={() => signIn("google")}
              >
                Sign In with Google
              </button>
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