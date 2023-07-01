import type { V2_MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export const meta: V2_MetaFunction = () => [{ title: "Olabar: Olahraga Bareng" }];

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="relative min-h-screen bg-pink-600 sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
            <div className="absolute inset-0">
              <img
                className="h-full w-full object-cover"
                src="https://img.freepik.com/free-photo/men-women-warm-up-before-after-exercising_1150-23003.jpg?w=1800&t=st=1688179933~exp=1688180533~hmac=4868ec8779f6672a916fe8e8d682417356596f20df014783c7c5db5b3d75b2ca"
                alt="BB King playing blues on his Gibson 'Lucille' guitar"
              />
              <div className="absolute inset-0 bg-[color:rgba(27,167,254,0.5)] mix-blend-multiply" />
            </div>
            <div className="relative px-4 pb-8 pt-16 sm:px-6 sm:pb-14 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-32">
              <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
                <span className="block uppercase text-pink-600 drop-shadow-md">
                  Olabar
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-sm text-center text-xl hover:bg-slate-600 text-stone-300 text-bold sm:max-w-3xl ">
              Olabar adalah sebuah platform yang bertujuan membantu menyatukan pengguna untuk kegiatan olahraga bersama
              </p>
              <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                {user ? (
                  <Link
                    to="/notes"
                    className="flex items-center justify-center rounded-md border border-transparent bg-pink-600 px-4 py-3 text-base font-medium text-stone-300 shadow-sm hover:bg-pink-900 sm:px-8"
                  >
                    selamat Datang {user.name} !
                  </Link>
                ) : (
                  <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                    <Link
                      to="/join"
                      className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-pink-600 shadow-sm hover:bg-blue-50 sm:px-8"
                    >
                      Sign up
                    </Link>
                    <Link
                      to="/login"
                      className="flex items-center justify-center rounded-md bg-pink-600 px-4 py-3 font-medium text-white hover:bg-pink-900"
                    >
                      Log In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-7xl text-center">
</div>
      </div>
    </main>
  );
}
