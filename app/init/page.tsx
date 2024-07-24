"use client";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/button-back";
import axios from "axios";
import { useState } from "react";

export default function Init() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const handleClick = async () => {
    // POST to api/init/route.ts
    setStatus("loading");
    axios
      .post("/api/init", {
        filePath: "/lib/data/example_data_movies.csv",
      })
      .then(() => setStatus("success"))
      .catch((e) => {
        console.error(e);
        setStatus("error");
      });
  };

  let content = <Button onClick={handleClick}>Load data</Button>;
  if (status !== "idle") {
    content = <span>{status}</span>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <BackButton />
      <h1 className="text-2xl font-bold my-5">Initialize embeddings</h1>
      <p className="mb-5">
        <ol className="list-decimal">
          <li>Add your data as a csv file in the lib/data folder.</li>
          <li>Edit this page to point to the file.</li>
          <li>Click the button below to embed and store the rows.</li>
        </ol>
      </p>
      {content}
    </div>
  );
}
