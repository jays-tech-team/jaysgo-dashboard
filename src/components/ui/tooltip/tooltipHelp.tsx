import { CircleHelp } from "lucide-react";
import Tooltip from "./tooltip";

type CircleHelpProps = {
  size?: number;
  text?: string | React.JSX.Element;
  icon?: React.JSX.Element;
};
export const HelpTooltip: React.FC<CircleHelpProps> = ({
  size = 16,
  text = "",
  icon = null,
}) => {
  return (
    <Tooltip text={text}>{icon ? icon : <CircleHelp size={size} />}</Tooltip>
  );
};
