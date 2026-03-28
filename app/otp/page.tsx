import { RefreshCwIcon } from "lucide-react"
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

export default function OTPPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FDECC8] px-4">
      <Card className="w-full max-w-md border-0 border-[#FF7500]/20 bg-[#FDECC8] text-[#FF7500] shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-black text-[#FF7500]">
            Verify your login
          </CardTitle>
          <CardDescription className="text-[#FF7500]/60">
            Enter the verification code we sent to your email address:{" "}
            <span className="font-semibold text-[#FF7500]">m@example.com</span>.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Field>
            <div className="mb-3 flex items-center justify-between">
              <FieldLabel
                htmlFor="otp-verification"
                className="text-sm font-semibold text-[#FF7500]"
              >
                Verification code
              </FieldLabel>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-[#FF7500]/20 bg-transparent text-xs text-[#FF7500] hover:bg-[#FF7500] hover:text-[#FDECC8]"
              >
                <RefreshCwIcon size={12} />
                Resend Code
              </Button>
            </div>

            <InputOTP maxLength={6} id="otp-verification" required>
              <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:border-[#FF7500]/30 *:data-[slot=input-otp-slot]:bg-[#FDECC8] *:data-[slot=input-otp-slot]:text-xl *:data-[slot=input-otp-slot]:text-[#FF7500]">
                <InputOTPSlot className="text-black" index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator className="mx-2 text-[#FF7500]/40" />
              <InputOTPGroup className="text-black *:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:border-[#FF7500]/30 *:data-[slot=input-otp-slot]:bg-[#FDECC8] *:data-[slot=input-otp-slot]:text-xl *:data-[slot=input-otp-slot]:text-[#FF7500]">
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
              type="submit"
              className="w-full bg-[#FF7500] text-[#FDECC8] hover:bg-[#333]"
            >
              Verify
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  )
}
