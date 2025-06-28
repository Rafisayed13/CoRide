
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const EarningsChart = () => {
  // Dummy data for comparison
  const lastWeek = [80, 90, 70, 85, 100, 110, 120];
  const thisWeek = [100, 110, 95, 105, 120, 130, 140];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Calculate % improvement
  const totalLast = lastWeek.reduce((a, b) => a + b, 0);
  const totalThis = thisWeek.reduce((a, b) => a + b, 0);
  const percentageChange = Math.round(((totalThis - totalLast) / totalLast) * 100);

  const chartData = {
    labels: days,
    datasets: [
      {
        label: "Last Week",
        data: lastWeek,
        backgroundColor: "gray",
      },
      {
        label: "This Week",
        data: thisWeek,
        backgroundColor: "green",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Earnings (AED)",
        },
      },
    },
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">📊 Captain Weekly Earnings Comparison</h2>
      <p className="text-green-600 font-medium mb-4">
        ✅ You earned {percentageChange}% more than last week!
      </p>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default EarningsChart;
