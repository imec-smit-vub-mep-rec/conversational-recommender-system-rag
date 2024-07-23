"use client";

import { Button } from "./button";

export const BackButton = () => {
  const goBack = () => {
    window.history.back();
  };

  return (
    <Button onClick={goBack} variant="ghost">
      &larr; Back
    </Button>
  );
};
