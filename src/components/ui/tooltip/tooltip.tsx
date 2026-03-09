import * as RadixTooltip from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

interface TooltipProps {
  children: ReactNode;
  text: string | React.JSX.Element;
  delayDuration?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  text,
  delayDuration = 200,
}) => {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root delayDuration={delayDuration}>
        <RadixTooltip.Trigger asChild>
          <span className="inline-block">{children}</span>
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side="top"
            sideOffset={8}
            className="rounded px-2 py-1 text-xs bg-gray-800 text-white shadow-lg z-50 max-w-xs"
          >
            {text}
            <RadixTooltip.Arrow className="fill-gray-800" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};

export default Tooltip;
