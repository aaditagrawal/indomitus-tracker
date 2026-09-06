"use client";

import { styleClass, type StyledProps } from "@/styles/classes";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

function Switch({
  className,
  xstyle,
  ...props
}: StyledProps<React.ComponentProps<typeof SwitchPrimitive.Root>>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(styleClass("componentsUiSwitchStyle1", xstyle), className)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={styleClass("componentsUiSwitchStyle2")}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
