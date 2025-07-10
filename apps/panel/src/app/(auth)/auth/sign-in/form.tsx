"use client"

import { redirect } from "next/navigation"
import { Button, cn } from "@pintudesa/ui"
import z from "zod"

import { useAppForm } from "@/components/form"
import Link from "@/components/link"
import { useToast } from "@/components/toast-provider"
import { authClient } from "@/lib/auth/client"

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { toast } = useToast()

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: z.object({
        email: z.string().email("Email tidak valid"),
        password: z
          .string()
          .min(8, "Password minimal 8 karakter")
          .regex(
            /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).*$/,
            "Password harus mengandung huruf besar, angka, dan simbol",
          ),
      }),
    },
    onSubmit: async ({ value }) => {
      const { data, error } = await authClient.signIn.email({
        email: value.email,
        password: value.password,
      })

      if (error) {
        toast({
          title: "Gagal masuk",
          description: error.message ?? "Terjadi kesalahan saat masuk",
        })
      }

      if (data) {
        redirect("/")
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        void form.handleSubmit()
      }}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col gap-6">
        <form.AppField name="email">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Email</form.FormLabel>
              <field.BaseField type="email" placeholder="Masukkan email" />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
        <form.AppField name="password">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Password</form.FormLabel>
              <field.BaseField
                type="password"
                placeholder="Masukkan password"
              />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
        <div className="flex flex-col gap-3">
          <Button type="submit" className="w-full">
            Masuk
          </Button>
        </div>
      </div>
      <div className="mt-4 text-center text-sm">
        Tidak memiliki akun?{" "}
        <Link href="/auth/sign-up" className="underline underline-offset-4">
          Daftar
        </Link>
      </div>
    </form>
  )
}
