
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center group",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200 group-hover:bg-gray-300 transition-colors">
      <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-brand-gradient-from to-brand-gradient-to rounded-full transition-all duration-200" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-white bg-gradient-to-r from-brand-gradient-from to-brand-gradient-to shadow-lg ring-0 ring-brand-accent/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/20 disabled:pointer-events-none disabled:opacity-50 hover:scale-110 hover:shadow-xl cursor-pointer" />
    {props.value && props.value.length > 1 && (
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-white bg-gradient-to-r from-brand-gradient-from to-brand-gradient-to shadow-lg ring-0 ring-brand-accent/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/20 disabled:pointer-events-none disabled:opacity-50 hover:scale-110 hover:shadow-xl cursor-pointer" />
    )}
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
