'use client';

import {
  Priority,
  Project,
  Task,
  useGetProjectsQuery,
  useGetTasksQuery,
} from '@/state/api';
import React from 'react';
import { useAppSelector } from '../redux';
import { DataGrid, GridColDef } from '@mui/x-data-grid'; // Import DataGrid and column definition types from Material UI
import Header from '@/components/Header';
// Import chart components from 'recharts' for data visualization
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils'; // Utility classes/styles for DataGrid

// columns for the MUI DataGrid
const taskColumns: GridColDef[] = [
  { field: 'title', headerName: 'Title', width: 200 },
  { field: 'status', headerName: 'Status', width: 150 },
  { field: 'priority', headerName: 'Priority', width: 150 },
  { field: 'dueDate', headerName: 'Due Date', width: 150 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const HomePage = () => {
  // Fetching Tasks
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetTasksQuery({ projectId: parseInt('1') });

  // Fetching Projects
  const { data: projects, isLoading: isProjectsLoading } =
    useGetProjectsQuery();

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (tasksLoading || isProjectsLoading) return <div>Loading..</div>;
  if (tasksError || !tasks || !projects) return <div>Error fetching data</div>;

  // Priority Distribution Calculation
  const priorityCount = tasks.reduce(
    (acc: Record<string, number>, task: Task) => {
      const { priority } = task;
      acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
      return acc;
    },
    {}
  );

  // Convert to Chart-Friendly Format
  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key],
  }));

  // Project Status Calculation
  const statusCount = projects.reduce(
    (acc: Record<string, number>, project: Project) => {
      const status = project.endDate ? 'Completed' : 'Active';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {}
  );

  //  Convert Project Status for Pie Chart
  const projectStatus = Object.keys(statusCount).map((key) => ({
    name: key,
    count: statusCount[key],
  }));

  // Conditional Chart Colors Based on Theme
  const chartColors = isDarkMode
    ? {
        bar: '#8884d8',
        barGrid: '#303030',
        pieFill: '#4A90E2',
        text: '#FFFFFF',
      }
    : {
        bar: '#8884d8',
        barGrid: '#E0E0E0',
        pieFill: '#82ca9d',
        text: '#000000',
      };

  return (
    <div className="container h-full w-[100%] bg-gray-100 bg-transparent p-8">
      {' '}
      // Container for the whole dashboard page
      <Header name="Project Management Dashboard" />
      {/* Grid layout to show 2 charts side by side on md+, stacked on mobile */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Card: Bar chart for Task Priority */}
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Task Priority Distribution
          </h3>
          {/* Responsive bar chart */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskDistribution}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.barGrid}
              />
              <XAxis dataKey="name" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip
                contentStyle={{
                  width: 'min-content',
                  height: 'min-content',
                }}
              />
              <Legend />
              <Bar dataKey="count" fill={chartColors.bar} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Card: Pie chart for Project Status */}
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Project Status
          </h3>
          {/* Responsive pie chart */}
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="count" data={projectStatus} fill="#82ca9d" label>
                {projectStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Full-width Card: DataGrid for tasks table */}
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary md:col-span-2">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Your Tasks
          </h3>
          {/* MUI DataGrid table */}
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={tasks}
              columns={taskColumns}
              checkboxSelection
              loading={tasksLoading}
              getRowClassName={() => 'data-grid-row'}
              getCellClassName={() => 'data-grid-cell'}
              className={dataGridClassNames}
              sx={dataGridSxStyles(isDarkMode)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
