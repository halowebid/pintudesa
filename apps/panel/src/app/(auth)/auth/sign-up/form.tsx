"use client"

import { redirect } from "next/navigation"
import { Button, cn } from "@pintudesa/ui"
import z from "zod"

import { useAppForm } from "@/components/form"
import Link from "@/components/link"
import { useToast } from "@/components/toast-provider"
import { authClient } from "@/lib/auth/client"

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { toast } = useToast()

  const form = useAppForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: z
        .object({
          email: z.string().email("Email tidak valid"),
          name: z
            .string()
            .min(3, "Nama minimal 3 karakter")
            .max(40, "Nama maksimal 40 karakter"),
          password: z
            .string()
            .min(8, "Password minimal 8 karakter")
            .regex(
              /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).*$/,
              "Password harus mengandung huruf besar, angka, dan simbol",
            ),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Password tidak sama",
          path: ["confirmPassword"],
        }),
    },
    onSubmit: async ({ value }) => {
      const { data, error } = await authClient.signUp.email({
        email: value.email,
        name: value.name,
        password: value.password,
        callbackURL: "/auth/sign-in",
      })

      if (error) {
        toast({
          title: "Gagal mendaftar",
          description: error.message ?? "Terjadi kesalahan saat mendaftar",
        })
      }

      if (data) {
        redirect("/auth/sign-in")
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
        <form.AppField name="name">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Nama</form.FormLabel>
              <field.BaseField type="text" placeholder="Masukkan nama" />
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
        <form.AppField name="confirmPassword">
          {(field) => (
            <form.FormItem>
              <form.FormLabel>Konfirmasi Password</form.FormLabel>
              <field.BaseField
                type="password"
                placeholder="Masukkan kembali password"
              />
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
        <div className="flex flex-col gap-3">
          <Button type="submit" className="w-full">
            Daftar
          </Button>
        </div>
      </div>
      <div className="mt-4 text-center text-sm">
        Sudah memiliki akun?{" "}
        <Link href="/auth/sign-in" className="underline underline-offset-4">
          Masuk
        </Link>
      </div>
    </form>
  )
}
