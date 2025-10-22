import { useFormContext } from "react-hook-form";
import type { RenderFormButtonProps } from "./render-form-button-model";
import { Button } from "@/components/ui/button";

export const RenderFormButton = ({
  buttonLabel,
  buttonClass,
  onSubmit,
}: RenderFormButtonProps) => {
  const { handleSubmit } = useFormContext();

  return (
    <Button
      variant={"outline"}
      onClick={handleSubmit(onSubmit)}
      className={`${buttonClass} cursor-pointer`}
    >
      {buttonLabel}
    </Button>
  );
};
