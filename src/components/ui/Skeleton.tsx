interface SkeltonProps {
  className?: string;
}
export default function Skelton({ className }: SkeltonProps) {
  return (
    <>
      <div
        className={`h-4 animate-pulse bg-gray-200 dark:bg-gray-700 rounded w-3/4 ${className}`}
      ></div>
    </>
  );
}
