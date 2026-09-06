"use client";

import { styles } from "@/styles/site.stylex";
import { styleClass } from "@/styles/classes";

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
    <div className={styleClass("appLoginPageStyle1")}>
      <div className={styleClass("appLoginPageStyle2")}>
        {status.type === "success" && (
          <Alert
            xstyle={styles.appLoginPageStyle3}
            className="sx-appLoginPageStyle3"
            data-test="success-alert"
          >
            <CheckCircle className={styleClass("appLoginPageStyle4")} />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}

        {status.type === "error" && (
          <Alert
            xstyle={styles.appLoginPageStyle5}
            className="sx-appLoginPageStyle5"
            data-test="error-alert"
          >
            <AlertCircle className={styleClass("appLoginPageStyle6")} />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}

        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
      </div>
    </div>
  );
}
