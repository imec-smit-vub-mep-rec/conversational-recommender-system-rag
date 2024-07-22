"use client";
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
        filePath: "/lib/data/movies.csv",
      })
      .then(() => setStatus("success"))
      .catch((e) => {
        console.error(e);
        setStatus("error");
      });
  };

  if (status === "idle") {
    return <button onClick={handleClick}>Load data</button>;
  } else {
    return <span>{status}</span>;
  }
}
