"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function Page() {
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (formData: FormData) => {
    setIsLoading(true);
    setStatus({ type: null, message: "" });

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setStatus({
        type: "error",
        message: "Email and password are required",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Call the API route instead of connecting directly to the database
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus({
          type: "error",
          message: data.error || "Invalid email or password",
        });
        setIsLoading(false);
        return;
      }

      // Success - store user data
      localStorage.setItem("user", JSON.stringify(data));

      setStatus({
        type: "success",
        message: "Login successful! Redirecting...",
      });

      // Redirect based on role after 1 second
      setTimeout(() => {
        if (data.role === "SUPERADMIN" || data.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/organizer/dashboard");
        }
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      setStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {status.type === "success" && (
          <Alert
            className="mb-6 border-green-500 bg-green-50 dark:bg-green-950/30"
            data-test="success-alert"
          >
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}

        {status.type === "error" && (
          <Alert
            className="mb-6 border-destructive bg-destructive/10"
            data-test="error-alert"
          >
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}

        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
      </div>
    </div>
  );
}
