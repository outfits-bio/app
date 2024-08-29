"use client";

import { useParams } from "next/navigation";

export function NotFoundHeader() {
  const params = useParams<{ username: string }>();

  return (
    <h1 className="text-center text-5xl font-black font-clash">
      {params.username}
    </h1>
  );
}
