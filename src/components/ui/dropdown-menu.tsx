"use client";

import { styleClass, type StyledProps } from "@/styles/classes";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

function DropdownMenuContent({
  className,
  xstyle,
  sideOffset = 4,
  ...props
}: StyledProps<React.ComponentProps<typeof DropdownMenuPrimitive.Content>>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          styleClass("componentsUiDropdownMenuStyle1", xstyle),
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

function DropdownMenuItem({
  className,
  xstyle,
  inset,
  variant = "default",
  ...props
}: StyledProps<React.ComponentProps<typeof DropdownMenuPrimitive.Item>> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        styleClass("componentsUiDropdownMenuStyle2", xstyle),
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  xstyle,
  children,
  checked,
  ...props
}: StyledProps<
  React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>
>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        styleClass("componentsUiDropdownMenuStyle3", xstyle),
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className={styleClass("componentsUiDropdownMenuStyle4")}>
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className={styleClass("componentsUiDropdownMenuStyle5")} />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  xstyle,
  children,
  ...props
}: StyledProps<React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        styleClass("componentsUiDropdownMenuStyle3", xstyle),
        className,
      )}
      {...props}
    >
      <span className={styleClass("componentsUiDropdownMenuStyle4")}>
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon
            className={styleClass("componentsUiDropdownMenuStyle8")}
          />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuLabel({
  className,
  xstyle,
  inset,
  ...props
}: StyledProps<React.ComponentProps<typeof DropdownMenuPrimitive.Label>> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        styleClass("componentsUiDropdownMenuStyle9", xstyle),
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  xstyle,
  ...props
}: StyledProps<React.ComponentProps<typeof DropdownMenuPrimitive.Separator>>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn(
        styleClass("componentsUiDropdownMenuStyle10", xstyle),
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  xstyle,
  ...props
}: StyledProps<React.ComponentProps<"span">>) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        styleClass("componentsUiCommandStyle13", xstyle),
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  xstyle,
  inset,
  children,
  ...props
}: StyledProps<
  React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger>
> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        styleClass("componentsUiDropdownMenuStyle12", xstyle),
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon
        className={styleClass("componentsUiDropdownMenuStyle13")}
      />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({
  className,
  xstyle,
  ...props
}: StyledProps<React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        styleClass("componentsUiDropdownMenuStyle14", xstyle),
        className,
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
