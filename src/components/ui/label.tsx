"use client";

import { styleClass, type StyledProps } from "@/styles/classes";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/utils";

function Label({
  className,
  xstyle,
  ...props
}: StyledProps<React.ComponentProps<typeof LabelPrimitive.Root>>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(styleClass("componentsUiLabelStyle1", xstyle), className)}
      {...props}
    />
  );
}

export { Label };
