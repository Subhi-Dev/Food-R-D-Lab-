import React, { useState } from 'react'
import { CheckCircle, XCircle, Activity, ArrowUpRight } from 'lucide-react'
import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Tooltip
} from 'recharts'
import ReportsDropdown from '../components/ReportsDropdown'

const Reports: React.FC = () => {
  const [filter, setFilter] = useState('All')

  // Mock Data for "Nutrient Retention" Chart (Area Chart)
  const nutrientData = [
    { name: 'T0', retention: 100 },
    { name: 'T1', retention: 98 },
    { name: 'T2', retention: 95 },
    { name: 'T3', retention: 94 },
    { name: 'T4', retention: 92 }
  ]

  // Mock Data for "Texture Analysis" (Pie Chart)
  const textureData = [
    { name: 'Firmness', value: 40 },
    { name: 'Springiness', value: 30 },
    { name: 'Cohesiveness', value: 30 }
  ]
  const TEXTURE_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899']

  const labReports = useQuery(api.labReports.list) ?? []

  const filteredReports = labReports.filter(
    (r: any) =>
      filter === 'All' ||
      (filter === 'Passed' && r.status === 'Approved') ||
      (filter === 'Failed' && r.status === 'Failed')
  )

  const handleReportAction = (action: string, report: any) => {
    console.log(`Action: ${action} on report: ${report._id}`)
    // Here you would implement logic to actually update the report status or trigger export
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Lab Reports
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium">
            QC Analysis & Performance Metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          {['All', 'Passed', 'Failed'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                filter === t
                  ? 'bg-gray-900 dark:bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-min">
        {/* Large Stats Card: Pass Rate */}
        <div className="col-span-1 md:col-span-2 bg-[#F0FDF4] dark:bg-emerald-900/10 dark:border dark:border-emerald-500/20 rounded-[2.5rem] p-8 flex flex-col justify-between min-h-[300px] relative overflow-hidden group">
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h3 className="text-emerald-900 dark:text-emerald-100 font-bold text-lg">
                Pass Rate
              </h3>
              <p className="text-emerald-700/60 dark:text-emerald-200/60 text-sm font-medium">
                Last 30 Days
              </p>
            </div>
            <div className="bg-white dark:bg-emerald-500/20 p-2 rounded-full text-emerald-600 dark:text-emerald-300 shadow-sm">
              <Activity size={24} />
            </div>
          </div>

          <div className="relative z-10 mt-auto">
            <span className="text-6xl font-bold text-emerald-900 dark:text-emerald-50 tracking-tighter">
              94%
            </span>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-emerald-200 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <ArrowUpRight size={12} /> +2.4%
              </span>
              <span className="text-emerald-800/60 dark:text-emerald-200/50 text-sm font-medium">
                vs last month
              </span>
            </div>
          </div>

          {/* Decorative Circle */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-200/50 dark:bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500"></div>
        </div>

        {/* Medium Card: Nutrient Retention */}
        <div className="col-span-1 md:col-span-1 bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col justify-between">
          <h3 className="text-gray-900 dark:text-white font-bold mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Nutrient Retention
          </h3>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={nutrientData}>
                <defs>
                  <linearGradient
                    id="colorRetention"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  cursor={false}
                />
                <Area
                  type="monotone"
                  dataKey="retention"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRetention)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-center text-gray-400 dark:text-slate-500 font-medium mt-2">
            Retention over processing time
          </p>
        </div>

        {/* Medium Card: Texture Analysis */}
        <div className="col-span-1 md:col-span-1 bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col justify-between">
          <h3 className="text-gray-900 dark:text-white font-bold mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            Texture Profile
          </h3>
          <div className="h-32 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={textureData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {textureData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={TEXTURE_COLORS[index % TEXTURE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-2 mt-2">
            <span className="h-1.5 w-6 rounded-full bg-blue-500"></span>
            <span className="h-1.5 w-6 rounded-full bg-purple-500"></span>
            <span className="h-1.5 w-6 rounded-full bg-pink-500"></span>
          </div>
        </div>

        {/* List of Reports */}
        <div className="col-span-1 md:col-span-4 grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          {filteredReports.map((report) => (
            <div
              key={report._id || (report as any).id}
              className="group bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-gray-200 dark:hover:border-slate-700 transition-all cursor-pointer flex items-center gap-6"
            >
              <div
                className={`w-16 h-16 rounded-[1.2rem] flex items-center justify-center text-xl font-bold flex-shrink-0 ${
                  report.status === 'Approved'
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : report.status === 'Failed'
                      ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      : 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                }`}
              >
                {report.status === 'Approved'
                  ? 'A+'
                  : report.status === 'Failed'
                    ? 'F'
                    : '-'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {report.projectName}
                  </h4>
                  <span className="text-xs text-gray-400 dark:text-slate-500 font-mono">
                    {report.lotNumber}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                  {report.results.length} Tests • Lead: {report.leadChemist}
                </p>

                <div className="flex gap-2 mt-3">
                  {report.results.slice(0, 2).map((res, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-gray-50 dark:bg-slate-800 rounded-lg text-xs font-medium text-gray-600 dark:text-slate-300 border border-gray-100 dark:border-slate-700"
                    >
                      {res.parameter}:{' '}
                      <span className="text-gray-900 dark:text-white font-bold">
                        {res.actualValue}
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <div title={`Status: ${report.status}`}>
                  {report.status === 'Approved' && (
                    <CheckCircle
                      className="text-green-500 dark:text-green-400"
                      size={24}
                    />
                  )}
                  {report.status === 'Failed' && (
                    <XCircle
                      className="text-red-500 dark:text-red-400"
                      size={24}
                    />
                  )}
                  {report.status === 'Pending' && (
                    <Activity
                      className="text-orange-500 dark:text-orange-400"
                      size={24}
                    />
                  )}
                </div>
                <ReportsDropdown
                  report={report}
                  onAction={handleReportAction}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Reports
