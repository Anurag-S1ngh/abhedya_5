"use client"

import Link from "next/link"
import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { forgotPassword, getApiErrorMessage, resetPassword } from "@/lib/api"
import {
  isValidNithEmail,
  NITH_EMAIL_ERROR,
  normalizeNithEmail,
} from "@/lib/nith-email"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  async function handleSendOTP() {
    const normalizedEmail = normalizeNithEmail(email)

    if (!normalizedEmail) {
      toast.error("Enter your email first.")
      return
    }

    if (!isValidNithEmail(normalizedEmail)) {
      toast.error(NITH_EMAIL_ERROR)
      return
    }

    setIsSending(true)

    try {
      const response = await forgotPassword({ email: normalizedEmail })
      setEmail(normalizedEmail)
      setOtpSent(true)
      toast.success(response.message || "Password reset OTP sent.")
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to send reset OTP."))
    } finally {
      setIsSending(false)
    }
  }

  async function handleResetPassword() {
    const normalizedEmail = normalizeNithEmail(email)

    if (!normalizedEmail || !otp.trim() || !password.trim()) {
      toast.error("Fill email, OTP, and new password.")
      return
    }

    if (!isValidNithEmail(normalizedEmail)) {
      toast.error(NITH_EMAIL_ERROR)
      return
    }

    setIsResetting(true)

    try {
      const response = await resetPassword({
        email: normalizedEmail,
        otp: otp.trim(),
        password,
      })
      toast.success(response.message || "Password reset successfully.")
      setOtp("")
      setPassword("")
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to reset password."))
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#88B7BD] px-4">
      <Card className="w-full max-w-md border border-[#FDECC8]/10 bg-[#88B7BD] text-[#FDECC8] shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-black text-[#FDECC8]">
            Forgot password
          </CardTitle>
          <CardDescription className="text-[#FDECC8]/60">
            Request an OTP and set a new password for your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="forgot-email">Email</Label>
            <Input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(normalizeNithEmail(e.target.value))}
              placeholder="24bcs108@nith.ac.in"
              className="border-[#FDECC8]/15 bg-[#0f0f0f] text-[#FDECC8]"
            />
          </div>

          <Button
            type="button"
            onClick={handleSendOTP}
            disabled={isSending}
            className="w-full bg-[#FF7500] text-[#FDECC8] hover:bg-[#e86a00]"
          >
            {isSending ? "Sending..." : "Send OTP"}
          </Button>

          {otpSent && (
            <>
              <div className="space-y-2">
                <Label htmlFor="forgot-otp">OTP</Label>
                <Input
                  id="forgot-otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the OTP"
                  className="border-[#FDECC8]/15 bg-[#0f0f0f] text-[#FDECC8]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="forgot-password">New password</Label>
                <Input
                  id="forgot-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a new password"
                  className="border-[#FDECC8]/15 bg-[#0f0f0f] text-[#FDECC8]"
                />
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="flex flex-col items-stretch gap-3">
          <Button
            type="button"
            onClick={handleResetPassword}
            disabled={!otpSent || isResetting}
            className="w-full bg-[#FF7500] text-[#FDECC8] hover:bg-[#e86a00]"
          >
            {isResetting ? "Resetting..." : "Reset password"}
          </Button>

          <Link
            href="/signin"
            className="text-center text-sm font-medium text-[#FDECC8] underline-offset-4 hover:underline"
          >
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
