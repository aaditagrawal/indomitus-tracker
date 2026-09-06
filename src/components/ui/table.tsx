"use client";

import { styleClass, type StyledProps } from "@/styles/classes";

import * as React from "react";

import { cn } from "@/lib/utils";

function Table({
  className,
  xstyle,
  ...props
}: StyledProps<React.ComponentProps<"table">>) {
  return (
    <div
      data-slot="table-container"
      className={styleClass("componentsUiTableStyle1")}
    >
      <table
        data-slot="table"
        className={cn(styleClass("componentsUiTableStyle2", xstyle), className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({
  className,
  xstyle,
  ...props
}: StyledProps<React.ComponentProps<"thead">>) {
  return (
    <thead
      data-slot="table-header"
      className={cn(styleClass("componentsUiTableStyle3", xstyle), className)}
      {...props}
    />
  );
}

function TableBody({
  className,
  xstyle,
  ...props
}: StyledProps<React.ComponentProps<"tbody">>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(styleClass("componentsUiTableStyle4", xstyle), className)}
      {...props}
    />
  );
}

function TableFooter({
  className,
  xstyle,
  ...props
}: StyledProps<React.ComponentProps<"tfoot">>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(styleClass("componentsUiTableStyle5", xstyle), className)}
      {...props}
    />
  );
}

function TableRow({
  className,
  xstyle,
  ...props
}: StyledProps<React.ComponentProps<"tr">>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(styleClass("componentsUiTableStyle6", xstyle), className)}
      {...props}
    />
  );
}

function TableHead({
  className,
  xstyle,
  ...props
}: StyledProps<React.ComponentProps<"th">>) {
  return (
    <th
      data-slot="table-head"
      className={cn(styleClass("componentsUiTableStyle7", xstyle), className)}
      {...props}
    />
  );
}

function TableCell({
  className,
  xstyle,
  ...props
}: StyledProps<React.ComponentProps<"td">>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(styleClass("componentsUiTableStyle8", xstyle), className)}
      {...props}
    />
  );
}

function TableCaption({
  className,
  xstyle,
  ...props
}: StyledProps<React.ComponentProps<"caption">>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(styleClass("componentsUiTableStyle9", xstyle), className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
