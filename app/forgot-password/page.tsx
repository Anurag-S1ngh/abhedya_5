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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  async function handleSendOTP() {
    if (!email.trim()) {
      toast.error("Enter your email first.")
      return
    }

    setIsSending(true)

    try {
      const response = await forgotPassword({ email: email.trim() })
      setOtpSent(true)
      toast.success(response.message || "Password reset OTP sent.")
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to send reset OTP."))
    } finally {
      setIsSending(false)
    }
  }

  async function handleResetPassword() {
    if (!email.trim() || !otp.trim() || !password.trim()) {
      toast.error("Fill email, OTP, and new password.")
      return
    }

    setIsResetting(true)

    try {
      const response = await resetPassword({
        email: email.trim(),
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
    <div className="flex min-h-screen items-center justify-center bg-[#FDECC8] px-4">
      <Card className="w-full max-w-md border-0 bg-[#FDECC8] text-[#FF7500] shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-black text-[#FF7500]">
            Forgot password
          </CardTitle>
          <CardDescription className="text-[#FF7500]/60">
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
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="border-[#FF7500]/20 bg-[#FDECC8]"
            />
          </div>

          <Button
            type="button"
            onClick={handleSendOTP}
            disabled={isSending}
            className="w-full bg-[#FF7500] text-[#FDECC8] hover:bg-[#333]"
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
                  className="border-[#FF7500]/20 bg-[#FDECC8]"
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
                  className="border-[#FF7500]/20 bg-[#FDECC8]"
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
            className="w-full bg-[#FF7500] text-[#FDECC8] hover:bg-[#333]"
          >
            {isResetting ? "Resetting..." : "Reset password"}
          </Button>

          <Link
            href="/signin"
            className="text-center text-sm font-medium text-[#FF7500] underline-offset-4 hover:underline"
          >
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
