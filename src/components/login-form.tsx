"use client";

import { styles } from "@/styles/site.stylex";
import { styleClass } from "@/styles/classes";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { FormEventHandler } from "react";

interface LoginFormProps extends Omit<
  React.ComponentProps<"form">,
  "onSubmit"
> {
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading?: boolean;
}

export function LoginForm({
  className,
  onSubmit,
  isLoading = false,
  ...props
}: LoginFormProps) {
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
  };

  return (
    <form
      className={cn(styleClass("componentsLoginFormStyle1"), className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className={styleClass("componentsLoginFormStyle2")}>
        <h1 className={styleClass("componentsDashboardStatsStyle5")}>
          Login to your account
        </h1>
        <p className={styleClass("componentsLoginFormStyle4")}>
          Enter your email below to login to your account
        </p>
      </div>
      <div className={styleClass("componentsLoginFormStyle5")}>
        <div className={styleClass("componentsLoginFormStyle6")}>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            disabled={isLoading}
            autoComplete="email"
          />
        </div>
        <div className={styleClass("componentsLoginFormStyle6")}>
          <div className={styleClass("componentsLoginFormStyle8")}>
            <Label htmlFor="password">Password</Label>
            <a href="#" className={styleClass("componentsLoginFormStyle9")}>
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            required
            disabled={isLoading}
            autoComplete="current-password"
          />
        </div>
        <Button
          type="submit"
          xstyle={styles.appAdminTeamsAddPageStyle13}
          className="sx-appAdminTeamsAddPageStyle13"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className={styleClass("componentsLoginFormStyle11")} />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </div>
    </form>
  );
}
