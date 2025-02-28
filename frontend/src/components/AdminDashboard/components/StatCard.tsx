import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: ReactNode;
  period?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, period }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 hover:border-purple-500 transition-all duration-300">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-400">{title}</h3>
        {icon}
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-green-500 text-sm mt-2 flex items-center">
        <span className="mr-1">↑</span> {change} from last {period || 'month'}
      </p>
    </div>
  );
};

export default StatCard;