import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 border-gray-800 bg-gray-900 text-white placeholder:text-gray-400 p-2",
       className
      )}
      {...props} />
  );
}

export { Input }
