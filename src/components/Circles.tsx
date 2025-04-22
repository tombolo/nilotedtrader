"use client";

import React, { useMemo } from "react";
import { useTickCounterContext } from "@/context/use-tickcounter";
import './Circles.css'

type CircleProps = {
  id: number;
  value: string;
  isHighlighted: boolean;
  percentage: number;
  isPointer?: boolean;
  fillColor?: string;
};

type CircleRowProps = {
  circles: CircleProps[];
  pointerPosition: number;
};

const Circle: React.FC<CircleProps> = ({
  id,
  value,
  isHighlighted,
  percentage,
  isPointer,
  fillColor = "#4BB4B3", // Default to Deriv teal
}) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full text-center transition-all duration-300 ease-in-out ${isHighlighted
          ? "ring-2 sm:ring-3 ring-[#FF444F] transform scale-110"
          : "hover:scale-105"
        }`}
      style={{
        backgroundColor: "#2A3052", // Consistent dark blue for all circles
        boxShadow: `
          0 0 0 1px rgba(255, 255, 255, 0.05),
          0 4px 6px -1px rgba(0, 0, 0, 0.2),
          0 2px 4px -1px rgba(0, 0, 0, 0.12),
          inset 0 1px 1px rgba(255, 255, 255, 0.08)
        `,
      }}
    >
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 50 50">
        {/* Base circle with subtle glow */}
        <circle
          cx="25"
          cy="25"
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="6"
        />
        {/* Percentage ring with beautiful fill */}
        <circle
          cx="25"
          cy="25"
          r={radius}
          fill="transparent"
          stroke={fillColor}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 25 25)"
          style={{
            filter: `drop-shadow(0 0 4px ${fillColor})`,
          }}
          className="transition-all duration-700 ease-in-out"
        />
      </svg>
      {/* Inner circle with glass effect */}
      <div
        className="absolute inset-0 flex items-center justify-center rounded-full"
        style={{
          width: "70%",
          height: "70%",
          top: "15%",
          left: "15%",
          background: `
            radial-gradient(
              circle at center,
              rgba(255, 255, 255, 0.15) 0%,
              rgba(255, 255, 255, 0.03) 70%
            )
          `,
          boxShadow: `
            inset 0 1px 1px rgba(255, 255, 255, 0.1),
            inset 0 -1px 2px rgba(0, 0, 0, 0.2)
          `,
        }}
      ></div>
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <span className="text-xs sm:text-sm font-bold text-white">{id}</span>
        <span className="text-[10px] sm:text-xs mt-0.5 sm:mt-1 text-white/80">
          {value}
        </span>
      </div>
      {/* Pointer with glowing effect */}
      {isPointer && (
        <div
          className="absolute -bottom-5 sm:-bottom-7 w-0 h-0 border-l-[6px] sm:border-l-[8px] border-r-[6px] sm:border-r-[8px] border-b-[10px] sm:border-b-[14px] border-l-transparent border-r-transparent border-b-[#FF444F] animate-bounce"
          style={{
            filter: "drop-shadow(0 0 4px #FF444F)",
          }}
        ></div>
      )}
    </div>
  );
};

const CircleRow: React.FC<CircleRowProps> = ({ circles, pointerPosition }) => {
  return (
    <div className="flex flex-col sm:flex-nowrap gap-4 sm:gap-6 items-center justify-center mr-8">
      <div className="grid grid-cols-5 gap-12">
        {circles.slice(0, 5).map((circle) => (
          <Circle
            key={circle.id}
            {...circle}
            isPointer={circle.id === pointerPosition}
          />
        ))}
      </div>
      <div className="grid grid-cols-5 gap-12">
        {circles.slice(5, 10).map((circle) => (
          <Circle
            key={circle.id}
            {...circle}
            isPointer={circle.id === pointerPosition}
          />
        ))}
      </div>
    </div>
  );
};

const CircleDesign: React.FC = () => {
  const { tickCounter, digitPercentages } = useTickCounterContext();
  const lastDigit = parseInt(tickCounter.toString().slice(-1), 10);

  const data = useMemo(() => {
    if (!digitPercentages || Object.keys(digitPercentages).length === 0) {
      return [];
    }

    const percentagesArray = Object.entries(digitPercentages).map(
      ([digit, percentage]) => ({
        id: parseInt(digit, 10),
        percentage,
      })
    );

    const minPercentageCircle = percentagesArray.reduce((min, current) =>
      current.percentage < min.percentage ? current : min
    );

    const maxPercentageCircle = percentagesArray.reduce((max, current) =>
      current.percentage > max.percentage ? current : max
    );

    return percentagesArray.map(({ id, percentage }) => {
      const value = `${percentage.toFixed(1)}%`;
      const isHighlighted = id === lastDigit;

      // Beautiful fill colors with Deriv theme
      let fillColor = "#4BB4B3"; // Default teal
      if (id === minPercentageCircle.id) {
        fillColor = "#FF444F"; // Deriv red
      } else if (id === maxPercentageCircle.id) {
        fillColor = "#7A91FF"; // Bright blue
      }

      return {
        id,
        value,
        isHighlighted,
        percentage,
        fillColor,
      };
    });
  }, [digitPercentages, lastDigit]);

  if (data.length === 0) {
    return (
      <div className="bg-transparent p-6 sm:p-8 z-50">
        <p className="text-center text-gray-500">Loading data...</p>
      </div>
    );
  }

  return (
    <div
      className="bg-[#0E0E2C] flex flex-col rounded-xl items-center justify-center w-full z-50 m-2"
      style={{
        boxShadow: `
          0 4px 20px rgba(0, 0, 0, 0.3),
          inset 0 1px 1px rgba(255, 255, 255, 0.08)
        `,
      }}
    >
      <div
        className="bg-[#15153B] rounded-xl flex items-center justify-center p-2 sm:p-8 w-full z-50"
        style={{
          boxShadow: `
            inset 0 1px 1px rgba(255, 255, 255, 0.05),
            0 2px 6px rgba(0, 0, 0, 0.2)
          `,
        }}
      >
        <CircleRow circles={data} pointerPosition={lastDigit} />
      </div>
    </div>
  );
};

export default CircleDesign;