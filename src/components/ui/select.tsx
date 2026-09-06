"use client";

import { styleClass, type StyledProps } from "@/styles/classes";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  xstyle,
  size = "default",
  children,
  ...props
}: StyledProps<React.ComponentProps<typeof SelectPrimitive.Trigger>> & {
  size?: "sm" | "default";
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(styleClass("componentsUiSelectStyle5", xstyle), className)}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className={styleClass("componentsUiSelectStyle6")} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  xstyle,
  children,
  position = "popper",
  ...props
}: StyledProps<React.ComponentProps<typeof SelectPrimitive.Content>>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          styleClass(
            position === "popper"
              ? "componentsUiSelectStyle1"
              : "componentsUiSelectStyle2",
            xstyle,
          ),
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={styleClass(
            position === "popper"
              ? "componentsUiSelectStyle3"
              : "componentsUiSelectStyle4",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  xstyle,
  ...props
}: StyledProps<React.ComponentProps<typeof SelectPrimitive.Label>>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(styleClass("componentsUiSelectStyle7", xstyle), className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  xstyle,
  children,
  ...props
}: StyledProps<React.ComponentProps<typeof SelectPrimitive.Item>>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(styleClass("componentsUiSelectStyle8", xstyle), className)}
      {...props}
    >
      <span className={styleClass("componentsUiSelectStyle9")}>
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className={styleClass("componentsUiDropdownMenuStyle5")} />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  xstyle,
  ...props
}: StyledProps<React.ComponentProps<typeof SelectPrimitive.Separator>>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(styleClass("componentsUiSelectStyle11", xstyle), className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  xstyle,
  ...props
}: StyledProps<React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(styleClass("componentsUiSelectStyle12", xstyle), className)}
      {...props}
    >
      <ChevronUpIcon className={styleClass("componentsUiDropdownMenuStyle5")} />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  xstyle,
  ...props
}: StyledProps<React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(styleClass("componentsUiSelectStyle12", xstyle), className)}
      {...props}
    >
      <ChevronDownIcon
        className={styleClass("componentsUiDropdownMenuStyle5")}
      />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
