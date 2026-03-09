import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../../lib/utils";
import AnimationPing from "./animationPing";
import { useHashTabs } from "../../hooks/useHashTabs";

interface TabsProps extends React.ComponentProps<typeof TabsPrimitive.Root> {
  useHash?: boolean;
  hashKey?: string;
  onTabChange?: (value: string) => void;
}

/**
 * This enhanced Radix UI tabs component supports URL hash-based state management, allowing you to maintain tab state in the URL for better user experience and navigation.
 *
 *
 * ## Features
 * URL Hash Integration: Tab state is automatically synchronized with URL hash
 * Multiple Hash Keys: Support for multiple tab groups on the same page
 * Backward Compatibility: Works with existing Radix UI tabs implementation
 * Hash Parsing: Helper functions to parse and build hash strings
 * History Management: Proper browser history integration
 *
 * The component uses a custom hash format: `#key1:value1|key2:value2`
 *
 * @param param0 TabsProps
 * @returns JSX.Element
 */
function Tabs({
  className,
  useHash = false,
  hashKey = "activeTab",
  onTabChange,
  value,
  onValueChange,
  defaultValue,
  ...props
}: TabsProps) {
  const hashTabs = useHashTabs({
    hashKey,
    defaultValue: defaultValue,
    onTabChange,
  });

  // Use hash-based state if useHash is true, otherwise use regular controlled state
  const tabValue = useHash ? hashTabs.activeTab : value;
  const handleValueChange = useHash ? hashTabs.changeTab : onValueChange;

  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      value={tabValue}
      onValueChange={handleValueChange}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900 ",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ping,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & { ping?: boolean }) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        " data-[state=active]:text-gray-900  data-[state=active]:bg-white focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring :data-[state=active]:border-input  text-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-2 text-sm font-medium --whitespace-nowrap  transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {props.children}
      {ping ? <AnimationPing /> : null}
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
