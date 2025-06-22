"use client"

import type { TRPCClientErrorLike } from "@trpc/client"

// TODO: move to UI Package
import { useToast } from "@/components/toast-provider"

export const useHandleTRPCError = () => {
  const { toast } = useToast()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (error: TRPCClientErrorLike<any>, defaultMessage: string) => {
    const errorData = error.data?.zodError?.fieldErrors

    if (errorData) {
      for (const field in errorData) {
        if (Object.prototype.hasOwnProperty.call(errorData, field)) {
          errorData[field]?.forEach((errorMessage: string) => {
            toast({
              description: errorMessage,
            })
          })
        }
      }
    } else {
      toast({
        description: defaultMessage,
      })
    }
  }
}
