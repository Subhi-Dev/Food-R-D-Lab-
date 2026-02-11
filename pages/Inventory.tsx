import React, { useState } from 'react'
import {
  Search,
  Plus,
  MoreHorizontal,
  Leaf,
  Droplets,
  Grid,
  Sun,
  Package,
  AlertTriangle
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'
import { useSettings } from '../context/SettingsContext'

const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { formatMass } = useSettings()

  // Pastel themes updated for dark mode
  const CARD_THEMES = [
    {
      bg: 'bg-[#F0F9FF] dark:bg-sky-900/20',
      text: 'text-sky-900 dark:text-sky-100',
      icon: 'bg-sky-200 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300'
    },
    {
      bg: 'bg-[#FDF2F8] dark:bg-pink-900/20',
      text: 'text-pink-900 dark:text-pink-100',
      icon: 'bg-pink-200 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300'
    },
    {
      bg: 'bg-[#F0FDF4] dark:bg-emerald-900/20',
      text: 'text-emerald-900 dark:text-emerald-100',
      icon: 'bg-emerald-200 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
    },
    {
      bg: 'bg-[#FFFBEB] dark:bg-amber-900/20',
      text: 'text-amber-900 dark:text-amber-100',
      icon: 'bg-amber-200 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
    },
    {
      bg: 'bg-[#F5F3FF] dark:bg-violet-900/20',
      text: 'text-violet-900 dark:text-violet-100',
      icon: 'bg-violet-200 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300'
    }
  ]

  const getIconForCategory = (category: string) => {
    switch (category) {
      case 'Stabilizers':
        return <Grid size={20} />
      case 'Sweeteners':
        return <Droplets size={20} />
      case 'Bases':
        return <Leaf size={20} />
      case 'Cultures':
        return <Sun size={20} />
      default:
        return <Package size={20} />
    }
  }

  const inventoryItems = useQuery(api.inventory.list) ?? []

  const filteredItems = inventoryItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Raw Materials
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium">
            Manage stock levels and batch expiry
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative group flex-1 md:flex-none">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 group-focus-within:text-gray-900 dark:group-focus-within:text-white transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-11 pr-6 py-3 bg-white dark:bg-slate-800 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-indigo-500/50 shadow-sm text-gray-900 dark:text-white dark:placeholder-slate-500"
            />
          </div>
          <button className="w-12 h-12 bg-gray-900 dark:bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-gray-800 dark:hover:bg-indigo-500 transition-colors shadow-lg shadow-gray-900/20 dark:shadow-indigo-600/20 flex-shrink-0">
            <Plus size={24} />
          </button>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item: any, idx: number) => {
          const theme = CARD_THEMES[idx % CARD_THEMES.length]
          const displayStock = formatMass(item.stock)

          return (
            <div
              key={item.id}
              className={`${theme.bg} dark:border dark:border-white/5 rounded-[2.5rem] p-7 flex flex-col justify-between h-[320px] relative group transition-transform hover:-translate-y-1 hover:shadow-lg dark:hover:bg-opacity-30`}
            >
              {/* Header */}
              <div className="flex justify-between items-start z-10">
                <div
                  className={`w-12 h-12 rounded-[1rem] ${theme.icon} flex items-center justify-center`}
                >
                  {getIconForCategory(item.category)}
                </div>
                <button
                  className={`p-2 rounded-full hover:bg-white/40 dark:hover:bg-white/10 transition-colors ${theme.text}`}
                >
                  <MoreHorizontal size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="z-10 mt-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-1 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                    {item.category}
                  </span>
                  {item.stockStatus === 'low' && (
                    <span className="px-2.5 py-1 bg-red-100/80 dark:bg-red-500/30 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wide text-red-600 dark:text-red-200 flex items-center gap-1">
                      <AlertTriangle size={10} /> Low
                    </span>
                  )}
                </div>
                <h3
                  className={`text-2xl font-bold ${theme.text} leading-tight mb-1`}
                >
                  {item.name}
                </h3>
                <p
                  className={`text-sm font-medium ${theme.text} opacity-70 font-mono`}
                >
                  {item.batchId}
                </p>
              </div>

              {/* Footer Details */}
              <div className="z-10 mt-auto bg-white/40 dark:bg-black/20 backdrop-blur-sm rounded-[1.5rem] p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs font-bold uppercase tracking-wide ${theme.text} opacity-60`}
                  >
                    Current Stock
                  </span>
                  <span className={`text-lg font-bold ${theme.text}`}>
                    {displayStock}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs font-bold uppercase tracking-wide ${theme.text} opacity-60`}
                  >
                    Expires
                  </span>
                  <span
                    className={`text-sm font-bold ${item.expiryStatus === 'expiring' ? 'text-red-600 dark:text-red-300' : theme.text}`}
                  >
                    {item.expiryDate}
                  </span>
                </div>

                {item.usedIn.length > 0 && (
                  <div className="pt-2 border-t border-gray-900/5 dark:border-white/10 flex items-center gap-2 overflow-hidden">
                    <span
                      className={`text-[10px] ${theme.text} opacity-60 whitespace-nowrap`}
                    >
                      Used in:
                    </span>
                    <div className="flex gap-1 overflow-x-auto no-scrollbar">
                      {item.usedIn.map((proj, i) => (
                        <Link
                          key={i}
                          to={`/project/${proj.id}`}
                          className="px-2 py-0.5 bg-white/60 dark:bg-white/10 rounded-full text-[10px] font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap hover:bg-white dark:hover:bg-white/20 transition-colors"
                        >
                          {proj.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Add New Card */}
        <button className="rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-slate-700 flex flex-col items-center justify-center gap-4 text-gray-400 dark:text-slate-500 hover:border-gray-300 dark:hover:border-slate-500 hover:text-gray-500 dark:hover:text-slate-300 hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-all h-[320px] group">
          <div className="w-16 h-16 rounded-[1rem] bg-gray-100 dark:bg-slate-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <Plus size={32} />
          </div>
          <span className="font-bold text-sm">Add Material</span>
        </button>
      </div>
    </div>
  )
}

export default Inventory
