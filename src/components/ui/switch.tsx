
import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => {
  // Check document direction for RTL
  const [isRTL, setIsRTL] = React.useState(false);
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsRTL(document.documentElement.dir === "rtl");
    }
  }, []);

  return (
    <SwitchPrimitives.Root
      className={cn(
        // الخلفية عند off يجب أن تكون bg-[#e7ebf1] وعند on تبقى teal
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-teal-500 data-[state=unchecked]:bg-[#e7ebf1] dark:data-[state=checked]:bg-teal-600 dark:data-[state=unchecked]:bg-[#282d38]",
        className
      )}
      {...props}
      ref={ref}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          // اللون يتغير حسب الثيم: أبيض في light، داكن في dark
          "pointer-events-none block h-5 w-5 rounded-full shadow-md ring-0 transition-transform",
          isRTL
            ? "data-[state=checked]:-translate-x-5 data-[state=unchecked]:translate-x-0"
            : "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
          "bg-white dark:bg-[#101723]" // أبيض في light وداكن في dark
        )}
      />
    </SwitchPrimitives.Root>
  );
});
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }

