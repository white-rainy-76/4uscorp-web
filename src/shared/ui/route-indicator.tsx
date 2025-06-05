import React from 'react'

interface RouteIndicatorProps {
  pointCount: number
}

export const RouteIndicator = ({ pointCount }: RouteIndicatorProps) => {
  return (
    <div className="flex flex-col items-center">
      {Array.from({ length: pointCount }).map((_, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="flex justify-center items-center w-6 h-6 bg-blue-600 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          {index < pointCount - 1 && (
            <>
              <div className="w-[3px] h-2 bg-blue-600 mb-1 flex-shrink-0"></div>
              <div className="w-[3px] h-2 bg-blue-600 my-1 flex-shrink-0"></div>
              <div className="w-[3px] h-2 bg-blue-600 my-1 flex-shrink-0"></div>
              <div className="w-[3px] h-2 bg-blue-600 mt-1 flex-shrink-0"></div>
              <div className="w-[3px] h-2 bg-blue-600 mt-1 flex-shrink-0"></div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
