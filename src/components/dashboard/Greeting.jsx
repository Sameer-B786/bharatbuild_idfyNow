"use client";

import { useEffect, useState } from "react";

export function Greeting() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <h2 className="text-2xl font-bold text-gray-900">Welcome,</h2>;
  }

  const hour = new Date().getHours();
  let greeting = "Good Morning,";
  if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon,";
  } else if (hour >= 17) {
    greeting = "Good Evening,";
  }

  return <h2 className="text-2xl font-bold text-gray-900">{greeting}</h2>;
}
