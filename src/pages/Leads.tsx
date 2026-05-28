import { useState, useEffect, useCallback } from 'react';
import { Users, ExternalLink, Download, Search, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';

const PASSWORD = 'Superhumanleads@123';
const PAGE_SIZE = 50;

interface Lead {
  id: string;
  first_name: string;
  whatsapp_number: string;
  created_at: string;
  messaged: boolean;
}

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function waLink(number: string) {
  return `https://wa.me/${number.replace(/[^0-9]/g, '')}`;
}

export default function Leads() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsTotal, setLeadsTotal] = useState(0);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsPage, setLeadsPage] = useState(0);
  const [leadsFilter, setLeadsFilter] = useState<'all' | 'messaged' | 'not_messaged'>('all');
  const [leadsSearch, setLeadsSearch] = useState('');
  const [leadsSearchInput, setLeadsSearchInput] = useState('');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === PASSWORD) {
      setAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect password');
    }
  };

  const fetchLeads = useCallback(async (
    page = leadsPage,
    filter = leadsFilter,
    search = leadsSearch,
  ) => {
    setLeadsLoading(true);
    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

    if (filter === 'messaged') query = query.eq('messaged', true);
    if (filter === 'not_messaged') query = query.eq('messaged', false);
    if (search.trim()) query = query.ilike('first_name', `%${search.trim()}%`);

    const { data, count } = await query;
    setLeads(data ?? []);
    setLeadsTotal(count ?? 0);
    setLeadsLoading(false);
  }, [leadsPage, leadsFilter, leadsSearch]);

  useEffect(() => {
    if (authenticated) fetchLeads();
  }, [authenticated]);

  useEffect(() => {
    if (authenticated) {
      setLeadsPage(0);
      fetchLeads(0, leadsFilter, leadsSearch);
    }
  }, [leadsFilter, leadsSearch]);

  useEffect(() => {
    if (authenticated) {
      fetchLeads(leadsPage, leadsFilter, leadsSearch);
    }
  }, [leadsPage]);

  const handleToggleMessaged = async (lead: Lead) => {
    const newVal = !lead.messaged;
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, messaged: newVal } : l));
    await supabase.from('leads').update({ messaged: newVal }).eq('id', lead.id);
  };

  const handleExportCsv = async () => {
    let query = supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (leadsFilter === 'messaged') query = query.eq('messaged', true);
    if (leadsFilter === 'not_messaged') query = query.eq('messaged', false);
    if (leadsSearch.trim()) query = query.ilike('first_name', `%${leadsSearch.trim()}%`);
    const { data } = await query;
    if (!data || data.length === 0) return;

    const headers = ['Timestamp', 'First Name', 'WhatsApp Number', 'Messaged'];
    const rows = data.map((l: Lead) => [
      formatTimestamp(l.created_at),
      l.first_name,
      l.whatsapp_number,
      l.messaged ? 'Yes' : 'No',
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(leadsTotal / PAGE_SIZE);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-sm w-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <Lock className="mx-auto h-10 w-10 text-gray-400 mb-4" />
              <h1 className="text-xl font-bold text-gray-900">Leads Access</h1>
              <p className="text-gray-500 mt-2 text-sm">Enter the password to view leads</p>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                  {authError}
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Enter
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-gray-500" />
            <h1 className="text-xl font-bold text-gray-900">Leads</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Controls row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                {leadsTotal} {leadsTotal === 1 ? 'lead' : 'leads'}
              </span>
              <div className="flex gap-1">
                {(['all', 'not_messaged', 'messaged'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setLeadsFilter(f)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      leadsFilter === f
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {f === 'all' ? 'All' : f === 'not_messaged' ? 'Not yet messaged' : 'Messaged'}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name"
                  value={leadsSearchInput}
                  onChange={(e) => setLeadsSearchInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setLeadsSearch(leadsSearchInput); }}
                  onBlur={() => setLeadsSearch(leadsSearchInput)}
                  className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-40"
                />
              </div>
            </div>
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">Timestamp</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">WhatsApp</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-600">Messaged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {leadsLoading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
                      </div>
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-gray-400 text-sm">
                      No leads yet.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                        {formatTimestamp(lead.created_at)}
                      </td>
                      <td className="px-4 py-3 text-gray-900 font-medium">{lead.first_name}</td>
                      <td className="px-4 py-3">
                        <a
                          href={waLink(lead.whatsapp_number)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors"
                        >
                          {lead.whatsapp_number}
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        </a>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={lead.messaged}
                          onChange={() => handleToggleMessaged(lead)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 cursor-pointer focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500">
                Page {leadsPage + 1} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setLeadsPage(p => Math.max(0, p - 1))}
                  disabled={leadsPage === 0}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setLeadsPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={leadsPage >= totalPages - 1}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
