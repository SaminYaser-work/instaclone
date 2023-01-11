import { HTMLAttributes, MouseEvent, MouseEventHandler } from "react";

type Props = {
  children: string;
  type: "button" | "submit" | "reset" | undefined;
  disabled: boolean;
  clickHandler: (e: MouseEvent<HTMLElement>) => void;
  className: string;
};

export default function Button({
  children,
  disabled,
  type,
  clickHandler,
  className,
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={clickHandler}
      className={className}
    >
      {children}
    </button>
  );
}
