import { formatINR, formatINRShort } from "@/lib/format";
import { cn } from "@/lib/utils";

interface MoneyTextProps {
  value: number;
  short?: boolean;
  signed?: boolean;
  className?: string;
}

export function MoneyText({ value, short, signed, className }: MoneyTextProps) {
  const text = short ? formatINRShort(value) : formatINR(value);
  return (
    <span
      className={cn(
        "num",
        signed && (value >= 0 ? "text-success" : "text-destructive"),
        className,
      )}
    >
      {signed && value > 0 ? "+" : ""}
      {text}
    </span>
  );
}
