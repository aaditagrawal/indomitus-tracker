import * as stylex from "@stylexjs/stylex";
import { styles } from "@/styles/site.stylex";
import { styleClass, type StyledProps, type XStyle } from "@/styles/classes";
import * as React from "react";
import type { ClassValue } from "clsx";

import { cn } from "@/lib/utils";

// Each compiled variant includes the shared base declarations and state markers.
// alertBase is the equivalent group for an explicitly null variant.
const variantStyles = {
  default: styles.alertvariantdefault,
  destructive: styles.alertvariantdestructive,
};
const variantMarkers = {
  default: "sx-alertvariantdefault ui-text-defined",
  destructive: "sx-alertvariantdestructive ui-text-defined",
};
type Variant = keyof typeof variantStyles;

type VariantOptions = { variant?: Variant | null };
/** Preserve the public class builder while compiling its atomic styles. */
function alertVariants({
  variant = "default",
  className,
  class: extraClass,
  xstyle,
}: VariantOptions & {
  className?: ClassValue;
  class?: ClassValue;
  xstyle?: XStyle;
} = {}) {
  return cn(
    stylex.props(variant ? variantStyles[variant] : styles.alertBase, xstyle)
      .className,
    variant ? variantMarkers[variant] : "sx-alertBase",
    className,
    extraClass,
  );
}

function Alert({
  className,
  xstyle,
  variant,
  ...props
}: StyledProps<React.ComponentProps<"div">> & VariantOptions) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant, xstyle }), className)}
      {...props}
    />
  );
}

function AlertTitle({
  className,
  xstyle,
  ...props
}: StyledProps<React.ComponentProps<"div">>) {
  return (
    <div
      data-slot="alert-title"
      className={cn(styleClass("componentsUiAlertStyle1", xstyle), className)}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  xstyle,
  ...props
}: StyledProps<React.ComponentProps<"div">>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(styleClass("componentsUiAlertStyle2", xstyle), className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
