import React, { useEffect, useState } from 'react';
import { Cpu, RefreshCw, AlertTriangle, CheckCircle, Power } from 'lucide-react';

interface ProviderState {
  provider: string;
  isEnabled: boolean;
  requestsToday: number;
  dailyLimit: number;
  minuteRequests: number;
  minuteLimit: number;
  consecutiveErrors: number;
  lastErrorMsg?: string;
}

export const QuotaDashboard: React.FC = () => {
  const [states, setStates] = useState<ProviderState[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuota = async () => {
    try {
      const res = await fetch('/api/admin/llm/quota');
      const data = await res.json();
      if (data?.states) {
        setStates(data.states);
      }
    } catch (e) {
      console.error('Failed to fetch LLM quota:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuota();
    const interval = setInterval(fetchQuota, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span>Multi-LLM Free Router Health Monitor</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Real-time daily quota tracking across Groq, Gemini, SambaNova, OpenRouter, and Sarvam.
          </p>
        </div>

        <button
          onClick={fetchQuota}
          className="btn-admin-indigo px-3 py-1.5 text-xs flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {states.map((st) => {
          const dailyPct = Math.min(100, Math.round((st.requestsToday / st.dailyLimit) * 100));
          const isWarning = dailyPct > 80 || st.consecutiveErrors > 0;

          return (
            <div key={st.provider} className="card-admin p-5 border-indigo-500/30">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-base text-white uppercase tracking-wider">
                  {st.provider}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    st.isEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}
                >
                  {st.isEnabled ? '● ONLINE' : '○ DISABLED'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 mb-4">
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <span>Daily Quota</span>
                  <span className="font-semibold">{st.requestsToday} / {st.dailyLimit} ({dailyPct}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      dailyPct > 85 ? 'bg-rose-500' : dailyPct > 60 ? 'bg-amber-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${dailyPct}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3 pt-2 border-t border-gray-800">
                <div>
                  <span className="block text-[10px] text-gray-500">RPM Limit</span>
                  <span className="font-semibold text-gray-200">{st.minuteRequests} / {st.minuteLimit}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-500">Errors</span>
                  <span className={`font-semibold ${st.consecutiveErrors > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {st.consecutiveErrors}
                  </span>
                </div>
              </div>

              {st.lastErrorMsg && (
                <div className="text-[11px] text-rose-400 bg-rose-950/40 p-2 rounded border border-rose-900 line-clamp-1">
                  {st.lastErrorMsg}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
