export interface RenderFormButtonProps {
  buttonLabel: string;
  buttonClass?: string;
  onSubmit: (data: Record<string, string>) => void;
}
