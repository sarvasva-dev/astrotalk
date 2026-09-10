import React from 'react';
import { Cpu, Users, Award, CreditCard, BookOpen, Settings, LayoutDashboard, Shield } from 'lucide-react';

interface AdminLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ activeTab, onTabChange, children }) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'llm', label: 'LLM Quota Router', icon: Cpu },
    { id: 'users', label: 'User Directory', icon: Users },
    { id: 'astrologers', label: 'Counsellors', icon: Award },
    { id: 'payments', label: 'Transactions', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen flex bg-[#0a0f1a] text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] border-r border-indigo-500/20 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 shadow-lg shadow-indigo-500/30 border border-indigo-500/50">
              <img src="/logo.png" alt="AstroGuru Admin" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-bold text-base text-white">AstroGuru Admin</h1>
              <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">
                Control Panel
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="text-xs text-gray-500 border-t border-gray-800 pt-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>v2.5 Enterprise Secure</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-[#111827]/80 border-b border-indigo-500/20 px-8 flex items-center justify-between backdrop-blur-md">
          <h2 className="text-lg font-bold text-white uppercase tracking-wide">
            {activeTab} Management
          </h2>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Backend Online (Express :3000)</span>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
