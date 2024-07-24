"use client";

import { Button } from "./button";

export const BackButton = () => {
  const goBack = () => {
    window.history.back();
  };

  return (
    <Button onClick={goBack} variant="outline">
      &larr; Back
    </Button>
  );
};
