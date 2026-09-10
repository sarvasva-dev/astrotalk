import React, { useState } from 'react';
import { AdminLayout } from './components/AdminLayout';
import { QuotaDashboard } from './components/QuotaDashboard';
import { Users, Award, CreditCard, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('llm');

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'llm' && <QuotaDashboard />}

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card-admin p-5">
              <div className="text-xs text-gray-400 mb-1">Total Users</div>
              <div className="text-2xl font-bold text-white">1,240</div>
            </div>
            <div className="card-admin p-5">
              <div className="text-xs text-gray-400 mb-1">Active Consultations</div>
              <div className="text-2xl font-bold text-emerald-400">18 Live</div>
            </div>
            <div className="card-admin p-5">
              <div className="text-xs text-gray-400 mb-1">LLM Free Traffic</div>
              <div className="text-2xl font-bold text-indigo-400">99.4%</div>
            </div>
            <div className="card-admin p-5">
              <div className="text-xs text-gray-400 mb-1">Total Savings Today</div>
              <div className="text-2xl font-bold text-amber-400">₹4,250</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card-admin p-6">
          <h3 className="font-bold text-lg text-white mb-4">User Directory</h3>
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Birth Date</th>
                  <th>Birth Place</th>
                  <th>Wallet</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-semibold text-white">Rahul Sharma</td>
                  <td>1998-05-15</td>
                  <td>New Delhi, India</td>
                  <td className="text-emerald-400 font-bold">₹150</td>
                  <td><span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">Active</span></td>
                </tr>
                <tr>
                  <td className="font-semibold text-white">Priya Patel</td>
                  <td>1995-11-20</td>
                  <td>Mumbai, India</td>
                  <td className="text-emerald-400 font-bold">₹340</td>
                  <td><span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">Active</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'astrologers' && (
        <div className="card-admin p-6">
          <h3 className="font-bold text-lg text-white mb-4">Counsellors Management</h3>
          <p className="text-xs text-gray-400">Manage online certified astrologers, rate per minute, and availability status.</p>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="card-admin p-6">
          <h3 className="font-bold text-lg text-white mb-4">Razorpay Payment Logs</h3>
          <p className="text-xs text-gray-400">Real-time webhook and transaction history.</p>
        </div>
      )}
    </AdminLayout>
  );
}
