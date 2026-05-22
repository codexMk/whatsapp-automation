"use client";

import { useState, useRef, useEffect } from "react";

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  loading?: boolean;
}

export function OTPInput({ length = 6, onComplete, loading = false }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only one digit per input
    setOtp(newOtp);

    // Move to next input if filled
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete if all fields are filled
    if (newOtp.every(digit => digit !== "") && index === length - 1) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain");
    const digits = pastedData.replace(/\D/g, "").slice(0, length);

    if (digits.length === length) {
      const newOtp = digits.split("");
      setOtp(newOtp);
      onComplete(digits);
    }
  };

  return (
    <div className="flex gap-3 justify-center">
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <input
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={loading}
            className="w-14 h-14 text-center text-2xl font-bold border-2 border-slate-300 rounded-lg focus:border-blue-600 focus:outline-none transition disabled:bg-slate-100"
          />
        ))}
    </div>
  );
}

interface OTPVerificationFormProps {
  onSubmit: (otp: string) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export function OTPVerificationForm({
  onSubmit,
  loading = false,
  error
}: OTPVerificationFormProps) {
  const [enteredOTP, setEnteredOTP] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleComplete = async (otp: string) => {
    setEnteredOTP(otp);
    setSubmitted(true);
    try {
      await onSubmit(otp);
    } catch (err) {
      setSubmitted(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">
          Enter OTP
        </h2>
        <p className="text-center text-slate-600">
          Check your email for a 6-digit OTP
        </p>
      </div>

      <OTPInput length={6} onComplete={handleComplete} loading={loading || submitted} />

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <p className="text-center text-sm text-slate-600">
        OTP expires in 5 minutes
      </p>
    </div>
  );
}
