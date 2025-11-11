"use client";
import React from "react";
import { usePathname } from "next/navigation";

export default function Breadcrumb({
  course,
}: {
  course: { name: string; _id: string } | undefined;
}) {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  const displaySegments = segments.map((seg) =>
    seg === course?._id ? course.name : seg
  );

  return <span>{displaySegments.join(" > ")}</span>;
}
