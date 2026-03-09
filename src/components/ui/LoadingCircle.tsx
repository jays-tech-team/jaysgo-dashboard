import { LoaderCircle } from "lucide-react";
import { cn } from "../../lib/utils";

const LoadingCircle: React.FC<{
  hidden?: boolean;
  size?: number;
  className?: string;
}> = ({ hidden = false, size = 18, className }) => {
  if (hidden) return null;
  return <LoaderCircle size={size} className={cn("animate-spin", className)} />;
};

export default LoadingCircle;
