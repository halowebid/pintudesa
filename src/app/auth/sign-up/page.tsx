import { enableSignUp } from "@/lib/env"
import { SignUpForm } from "./form"

export default function Page() {
  return (
    <div className="container mx-auto flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        {enableSignUp ? (
          <SignUpForm />
        ) : (
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-bold">Pendaftaran Ditutup</h1>
            <p className="text-muted-foreground text-sm">
              Pendaftaran akun baru saat ini tidak tersedia. Silakan hubungi
              administrator untuk informasi lebih lanjut.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
