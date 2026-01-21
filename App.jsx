import React, { useState, useEffect } from 'react'
import DepartmentTable from './components/DepartmentTable'
import DepartmentEmissionsChart from './components/DepartmentEmissionsChart'
import ChatBotBubble from './components/ChatBotBubble'
import EmissionsPieChart from './components/EmissionsPieChart'
import ElectricityPieChart from './components/ElectricityPieChart'
import { Menu, ArrowUpRight, ArrowDownRight, Sun, Moon, LogOut } from 'lucide-react'
import { supabase } from './supabaseClient'
import { Link, useNavigate } from 'react-router-dom'
import ChatlingWidget from './components/ChatlingWidget'

function App() {
  const [month, setMonth] = useState('All')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [theme, setTheme] = useState('dark')
  const [totals, setTotals] = useState({ emissions: 0, electricity: 0, emissionsChange: 0, electricityChange: 0 })

  const navigate = useNavigate()

  useEffect(() => {
    fetchTotals()
    checkAuth()
  }, [month])

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'
  }, [theme])

  // ✅ Logout handler
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Logout error:', error.message)
    } else {
      navigate('/login') // redirect after signout
    }
  }

  // ✅ Check if user is logged in, redirect if not
  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      navigate('/login')
    }
  }

  // Fetch monthly totals
  const fetchTotals = async () => {
    const monthMap = { January: 0, February: 1, March: 2, April: 3, May: 4, June: 5, July: 6, August: 7, September: 8, October: 9, November: 10, December: 11 }
    const year = new Date().getFullYear()
    const getRange = m => [new Date(Date.UTC(year, m, 1)).toISOString(), new Date(Date.UTC(year, m + 1, 1)).toISOString()]

    let { data, error } = await supabase.from('electricity_usage').select('emission, monthly_usage, month')
    if (error) return console.error(error)

    let thisMonthData = [], lastMonthData = []
    if (month === 'All') {
      thisMonthData = data
    } else {
      const monthNum = monthMap[month]
      const [start, end] = getRange(monthNum)
      const [lastStart, lastEnd] = getRange(monthNum === 0 ? 11 : monthNum - 1)
      thisMonthData = data.filter(d => d.month >= start && d.month < end)
      lastMonthData = data.filter(d => d.month >= lastStart && d.month < lastEnd)
    }

    const sum = (arr, key) => arr.reduce((acc, d) => acc + (d[key] || 0), 0)
    setTotals({
      emissions: sum(thisMonthData, 'emission'),
      electricity: sum(thisMonthData, 'monthly_usage'),
      emissionsChange: sum(thisMonthData, 'emission') - sum(lastMonthData, 'emission'),
      electricityChange: sum(thisMonthData, 'monthly_usage') - sum(lastMonthData, 'monthly_usage')
    })
  }

  const renderChange = (value, unit) => (
    value >= 0
      ? <span className="text-red-400 flex items-center text-sm mt-1"><ArrowUpRight size={14} className="mr-1" />+{value.toFixed(2)} {unit}</span>
      : <span className="text-green-400 flex items-center text-sm mt-1"><ArrowDownRight size={14} className="mr-1" />-{Math.abs(value).toFixed(2)} {unit}</span>
  )

  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans transition-colors duration-300">
      <video autoPlay loop muted playsInline className="fixed top-0 left-0 w-full h-full object-cover -z-20">
        <source src="/bg-video.mp4" type="video/mp4" />
      </video>
      <div className={`fixed inset-0 ${theme === 'dark' ? 'bg-black/60' : 'bg-white/80'} backdrop-blur-sm -z-10`} />

      {/* Top Navigation Bar */}
      <header className="flex justify-between items-center px-6 py-4 backdrop-blur-lg bg-opacity-60 shadow-lg z-20 relative">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)} className="bg-white text-black p-2 rounded-full shadow hover:bg-green-500 transition">
            <Menu size={22} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold">🌿 Carbon Footprint Tracker</h1>
        </div>

        <div className="flex items-center gap-4">
          <select value={month} onChange={e => setMonth(e.target.value)} className="p-2 rounded bg-white text-black font-semibold shadow">
            <option value="All">All Months</option>
            {Object.keys({ January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, September: 9, October: 10, November: 11, December: 12 }).map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="bg-white text-black p-2 rounded-full shadow hover:bg-green-500 transition">
            {theme === 'dark' ? <Sun size={22} className="text-yellow-400 animate-spin-slow" /> : <Moon size={22} />}
          </button>

          {/* ✅ Working logout button */}
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow transition">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 ${theme === 'dark' ? 'bg-black' : 'bg-white'} bg-opacity-90 backdrop-blur-lg z-30 p-6 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>Navigation</h2>
          <button onClick={() => setIsSidebarOpen(false)} className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-black'}`}>&times;</button>
        </div>
        <ul className="space-y-4 text-lg">
         
          <li><Link to="/liveproject" className="hover:text-green-400">🚀 Live Project</Link></li>
          <li><Link to="/profile" className="hover:text-green-400"></Link></li>
        </ul>
      </aside>

      {/* KPI Cards */}
      <section className="max-w-7xl mx-auto flex flex-wrap justify-center gap-6 mt-20 mb-10 px-4">
        <div className={`${theme === 'dark' ? 'bg-gray-900/80' : 'bg-gray-200/90'} p-6 w-64 text-center rounded-lg shadow-lg`}>
          <h3 className="text-lg font-semibold">Total Emissions</h3>
          <p className="text-3xl font-bold text-red-400">{totals.emissions.toFixed(2)} kg CO₂</p>
          {renderChange(totals.emissionsChange, 'kg')}
        </div>
        <div className={`${theme === 'dark' ? 'bg-gray-900/80' : 'bg-gray-200/90'} p-6 w-64 text-center rounded-lg shadow-lg`}>
          <h3 className="text-lg font-semibold">Electricity Usage</h3>
          <p className="text-3xl font-bold text-green-400">{totals.electricity.toFixed(2)} kWh</p>
          {renderChange(totals.electricityChange, 'kWh')}
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto space-y-10 pb-16 px-4">
        <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold mb-4">📊 Department Emissions</h2>
          <DepartmentEmissionsChart month={month} />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">🌎 Emissions Breakdown</h2>
            <EmissionsPieChart month={month} />
          </div>

          <div className="flex-1 bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">⚡ Electricity Usage Breakdown</h2>
            <ElectricityPieChart month={month} />
          </div>
        </div>

        <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold mb-4">🏢 Department Data Overview</h2>
          <DepartmentTable month={month} />
          <ChatBotBubble />
        </div>
      </main>

     
      <footer className="text-center text-sm text-gray-400 mt-12 mb-4">
        © 2025 Carbon Footprint Tracker. All rights reserved.
      </footer>
      <ChatlingWidget />
    </div>
    
    
  )
}

export default App