
// Map color names to actual Tailwind classes to avoid string interpolation issues
export const getColorClass = (color: string, type: 'bg' | 'text' | 'border') => {
  const colorMap: Record<string, Record<string, string>> = {
    blue: { bg: "bg-blue-50", text: "text-blue-500", border: "border-blue-300" },
    purple: { bg: "bg-purple-50", text: "text-purple-500", border: "border-purple-300" },
    green: { bg: "bg-green-50", text: "text-green-500", border: "border-green-300" },
    orange: { bg: "bg-orange-50", text: "text-orange-500", border: "border-orange-300" },
    yellow: { bg: "bg-yellow-50", text: "text-yellow-500", border: "border-yellow-300" }
  };
  
  return colorMap[color]?.[type] || "";
};
