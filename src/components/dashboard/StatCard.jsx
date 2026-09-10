import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({ title, value, trend, trendValue, icon: Icon }) {
  const isPositive = trend === "up";

  return (
    <div className="bg-white rounded-2xl p-6 border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="p-2 bg-orange-50 text-orange-500 rounded-xl">
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
      {trendValue && (
        <div className={cn("flex items-center text-xs mt-3 font-medium", isPositive ? "text-emerald-600" : "text-red-600")}>
          {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {trendValue}
        </div>
      )}
    </div>
  );
}
