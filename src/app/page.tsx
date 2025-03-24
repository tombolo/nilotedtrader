"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Circles from "@/components/Circles";
import { MdTouchApp } from "react-icons/md";
import { IoMdPulse } from "react-icons/io";
import "./page.css";

// Lazy load SmartChartComponent with SSR disabled
const SmartChartComponent = dynamic(() => import("@/components/SmartChartComponent"), {
  ssr: false,
});

const categories = [
  {
    title: "",
    items: [
      { name: "Matches/Differs", icon: <MdTouchApp className="text-xl text-purple-500" /> },
      { name: "Even/Odd", icon: <MdTouchApp className="text-xl text-orange-500" /> },
      { name: "Over/Under", icon: <IoMdPulse className="text-xl text-teal-500" /> },
    ],
  },
];

export default function Home() {
  const hasReloaded = useRef(false);
  const pathname = usePathname();
  const pageKey = `hasReloaded-${pathname}`;
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem(pageKey);
    };
  }, [pathname]);

  const handleSelectItem = (name: string) => {
    setSelectedItem(name);
    setShowDropdown(false); // Close dropdown after selection
  };

  return (
    <div className="bg-white min-h-screen w-full flex flex-col overflow-x-hidden">
      {/* SmartChartComponent */}
      <div className="flex flex-col h-full w-full items-center justify-items-start overflow-x-hidden">
        {/* Set the width of the container to 600px and ensure it doesn't overflow */}
        <div className="flex">
          <SmartChartComponent />
        </div>
        <div className="flex items-center justify-center w-full">
          <Circles />
        </div>
      </div>
    </div>
  );
}
