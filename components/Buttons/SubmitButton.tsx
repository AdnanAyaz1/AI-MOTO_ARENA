import { LoaderCircleIcon } from "lucide-react";
import React from "react";

import { Button } from "../ui/button";

const SubmitButton = ({
  isLoading,
  text,
  disabled,
}: {
  isLoading: boolean;
  text?: string;
  disabled?: boolean;
}) => {
  return (
    <Button
      variant={"default"}
      className="bg-primary hover:bg-primary/90 cursor-pointer w-full h-[45px] paragraph-semibold text-white"
      type="submit"
      disabled={isLoading || disabled}
    >
      {isLoading && <LoaderCircleIcon className="mr-2 size-4 animate-spin" />}
      {text}
    </Button>
  );
};

export default SubmitButton;
