"use client"

import { RefreshCwIcon } from "lucide-react"
import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {
  getApiErrorMessage,
  resendVerificationOTP,
  verifyEmail,
} from "@/lib/api"
import {
  isValidNithEmail,
  NITH_EMAIL_ERROR,
  normalizeNithEmail,
} from "@/lib/nith-email"

function OTPPageContent() {
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [email, setEmail] = useState("")
  const [resendCooldown, setResendCooldown] = useState(15)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const pendingEmail =
      searchParams.get("email") ||
      window.sessionStorage.getItem("pendingVerificationEmail") ||
      ""

    setEmail(normalizeNithEmail(pendingEmail))
  }, [searchParams])

  useEffect(() => {
    if (resendCooldown <= 0) {
      return
    }

    const timer = window.setInterval(() => {
      setResendCooldown((current) => {
        if (current <= 1) {
          window.clearInterval(timer)
          return 0
        }

        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [resendCooldown])

  async function handleVerify() {
    if (otp.length < 6) {
      toast.error("Please enter the full 6-digit code.")
      return
    }

    const normalizedEmail = normalizeNithEmail(email)

    if (!normalizedEmail) {
      toast.error("Missing email for verification. Please sign up again.")
      return
    }

    if (!isValidNithEmail(normalizedEmail)) {
      toast.error(NITH_EMAIL_ERROR)
      return
    }

    setIsLoading(true)

    try {
      const response = await verifyEmail({ email: normalizedEmail, otp })
      window.sessionStorage.removeItem("pendingVerificationEmail")
      toast.success(response.message || "Verified successfully.")
      router.push("/signin")
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Invalid code. Please try again."))
    } finally {
      setIsLoading(false)
    }
  }

  async function handleResend() {
    const normalizedEmail = normalizeNithEmail(email)

    if (!normalizedEmail) {
      toast.error("Missing email for verification. Please sign up again.")
      return
    }

    if (!isValidNithEmail(normalizedEmail)) {
      toast.error(NITH_EMAIL_ERROR)
      return
    }

    setIsResending(true)

    try {
      const response = await resendVerificationOTP({ email: normalizedEmail })
      toast.success(
        response.message || "A new code has been sent to your email."
      )
      setResendCooldown(15)
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Failed to resend verification OTP.")
      )
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#88B7BD] px-4">
      <Card className="w-full max-w-md border border-[#FDECC8]/10 bg-[#88B7BD] text-[#FDECC8] shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-black text-[#FDECC8]">
            Verify your login
          </CardTitle>
          <CardDescription className="text-[#FDECC8]/60">
            Enter the verification code we sent to your email address:{" "}
            <span className="font-semibold text-[#FDECC8]">
              {email || "your email"}
            </span>
            .
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Field>
            <div className="mb-3 flex items-center justify-between">
              <FieldLabel
                htmlFor="otp-verification"
                className="text-sm font-semibold text-[#FDECC8]"
              >
                Verification code
              </FieldLabel>
            </div>

            <InputOTP
              maxLength={6}
              id="otp-verification"
              value={otp}
              onChange={setOtp}
            >
              <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:border-[#FDECC8]/20 *:data-[slot=input-otp-slot]:bg-[#0f0f0f] *:data-[slot=input-otp-slot]:text-xl *:data-[slot=input-otp-slot]:text-[#FDECC8]">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator className="mx-2 text-[#FDECC8]/40" />
              <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:border-[#FDECC8]/20 *:data-[slot=input-otp-slot]:bg-[#0f0f0f] *:data-[slot=input-otp-slot]:text-xl *:data-[slot=input-otp-slot]:text-[#FDECC8]">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </Field>
        </CardContent>

        <CardFooter>
          <Field className="w-full">
            <Button
              onClick={handleVerify}
              disabled={isLoading}
              className="w-full bg-[#FF7500] text-[#FDECC8] hover:bg-[#e86a00]"
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResend}
              disabled={isResending || resendCooldown > 0}
              className="gap-1.5 border-[#FDECC8]/15 bg-transparent text-xs text-[#FDECC8] hover:bg-[#FF7500] hover:text-[#FDECC8]"
            >
              <RefreshCwIcon size={12} />
              {isResending
                ? "Resending..."
                : resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend Code"}
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function OTPPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#88B7BD] px-4 text-sm text-[#FDECC8]/60">
          Loading verification page...
        </div>
      }
    >
      <OTPPageContent />
    </Suspense>
  )
}
