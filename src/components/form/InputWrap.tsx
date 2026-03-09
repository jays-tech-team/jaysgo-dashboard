import { cn } from "../../lib/utils";
import { HelpTooltip } from "../ui/tooltip/tooltipHelp";
import { InputMessage } from "./InputError";
import Label from "./Label";
import RequiredStar from "./RequiredStar";

type InputWrapType = {
  children: React.ReactNode;
  /**
   * Class for input wrapper.
   * use: no-rtl to exclude form direction css property (direction: rtl) added in index.css
   *
   */
  className?: string;
  label?: string;
  error?: string;
  required?: boolean;
  tooltip?: string | React.JSX.Element;
  hidden?: boolean;
  tooltipIcon?: React.JSX.Element;
};

export function InputWrap({
  children,
  className = "",
  label,
  error,
  required = false,
  tooltip,
  hidden = false,
  tooltipIcon,
}: InputWrapType) {
  if (hidden) return null;
  return (
    <div className={cn(`input-wrap`, className, error ? "has-error" : "")}>
      {label && (
        <Label>
          <span>
            {label}
            <RequiredStar required={required} />
          </span>

          {tooltip && <HelpTooltip text={tooltip} icon={tooltipIcon} />}
        </Label>
      )}
      {children}
      {error && <InputMessage error={!!error} message={error} />}
    </div>
  );
}
