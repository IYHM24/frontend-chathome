import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"

const SideBarSkeleton = () => {
  return (
    <div className="overflow-y-auto h-[calc(100vh-132px)]">
      {[...Array(10)].map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="flex items-center gap-3 p-3"
        >
          {/* Avatar skeleton */}
          <div className="relative">
            <Skeleton className=" bg-gray-800 h-12 w-12 rounded-full" />
          </div>

          {/* Chat info skeleton */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              {/* Name skeleton */}
              <Skeleton className=" bg-gray-800 h-4 w-24" />
              {/* Time skeleton */}
              <Skeleton className=" bg-gray-800 h-3 w-10" />
            </div>
            <div className="flex justify-between items-center">
              {/* Message skeleton */}
              <Skeleton className=" bg-gray-800 h-3 w-32" />
              {/* Optional unread count skeleton */}
              <Skeleton className=" bg-gray-800 h-4 w-4 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SideBarSkeleton
