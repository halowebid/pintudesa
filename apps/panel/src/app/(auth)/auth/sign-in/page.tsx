import { siteTitle } from "@pintudesa/env"

import { SignInForm } from "./form"

export default function Page() {
  return (
    <div className="container mx-auto flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold">Selamat Datang di {siteTitle}</h1>
        </div>
        <SignInForm />
      </div>
    </div>
  )
}
