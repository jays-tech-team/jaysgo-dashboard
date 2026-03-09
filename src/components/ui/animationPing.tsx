import { cn } from "../../lib/utils";

interface AnimationPingProps {
  count?: number | string;
  className?: string;
  hidden?: boolean;
}
const AnimationPing: React.FC<AnimationPingProps> = ({
  count,
  className,
  hidden = false,
}) => {
  if (hidden) return null;
  return (
    <span
      className={cn(
        `relative h-4 w-4 rounded-full bg-orange-400 text-white items-center justify-center leading-0 flex`,
        className
      )}
      style={{ fontSize: "10px" }}
    >
      <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
      {count}
    </span>
  );
};

export default AnimationPing;
