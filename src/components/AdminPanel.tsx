import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { Search, Download, Trash2, CheckCircle, Loader2, LogOut, Eye, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [consultations, setConsultations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Detail View State (replaces modal)
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchConsultations();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'astro' && password === 'astro@123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      fetchConsultations();
      toast.success('Login successful');
    } else {
      toast.error('Invalid credentials');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    navigate('/');
  };

  const fetchConsultations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Fetch error:", error);
        toast.error('Failed to fetch data or table does not exist.');
      } else {
        setConsultations(data || []);
      }
    } catch (error: any) {
      toast.error('Failed to fetch data');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Pending' ? 'Done' : 'Pending';
    try {
      const { error } = await supabase
        .from('consultations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setConsultations(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      
      // Update detail state if open
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest({ ...selectedRequest, status: newStatus });
      }

      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteEntry = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('consultations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setConsultations(prev => prev.filter(c => c.id !== id));
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest(null);
      }
      toast.success('Entry deleted successfully');
    } catch (error) {
      toast.error('Failed to delete entry');
    }
  };

  const exportToCSV = () => {
    if (consultations.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = ['ID', 'Full Name', 'DOB', 'TOB', 'POB', 'Phone', 'Question', 'Status', 'Consent Accepted', 'Palm Photo 1', 'Palm Photo 2', 'Date'];
    const csvData = consultations.map(c => [
      c.id,
      `"${c.full_name}"`,
      c.dob,
      c.tob,
      `"${c.pob}"`,
      c.phone,
      `"${c.question?.replace(/"/g, '""') || ''}"`,
      c.status,
      c.consent_accepted ? 'Yes' : 'No',
      c.palm_photo_url ? `"${c.palm_photo_url}"` : 'N/A',
      c.palm_photo_url_2 ? `"${c.palm_photo_url_2}"` : 'N/A',
      new Date(c.created_at).toLocaleString()
    ]);

    const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `consultations_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredConsultations = consultations.filter(c => 
    c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone?.includes(searchTerm)
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-4">
        <div className="glass-card p-8 rounded-3xl w-full max-w-md mt-20">
          <h2 className="text-3xl font-serif font-bold text-center text-dark mb-8">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-dark/80 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark/80 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/50"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-gold hover:bg-gold-dark text-white rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- DETAIL VIEW (Same Screen, No Pop-up) ---
  if (selectedRequest) {
    return (
      <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 mt-10 relative z-10 animate-in fade-in duration-300">
        <div className="max-w-7xl mx-auto">
          
          <button 
            onClick={() => setSelectedRequest(null)}
            className="flex items-center gap-2 px-4 py-2 mb-8 bg-white border border-gold/20 text-dark rounded-xl hover:bg-gold/5 transition-colors shadow-sm w-fit font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Requests
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left side: Details Card */}
            <div className="lg:col-span-4 bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-gold/20 space-y-6 lg:sticky lg:top-28">
              <h2 className="text-2xl font-serif font-bold text-dark border-b border-gold/10 pb-4">Customer Details</h2>
              
              <div>
                <p className="text-[11px] text-dark/50 uppercase tracking-widest font-bold mb-1">Name</p>
                <p className="text-lg font-medium text-dark">{selectedRequest.full_name}</p>
              </div>
              <div>
                <p className="text-[11px] text-dark/50 uppercase tracking-widest font-bold mb-1">Phone</p>
                <p className="text-lg font-medium text-dark">{selectedRequest.phone}</p>
              </div>
              <div>
                <p className="text-[11px] text-dark/50 uppercase tracking-widest font-bold mb-1">Birth Date</p>
                <p className="text-lg font-medium text-dark">{selectedRequest.dob}</p>
              </div>
              <div>
                <p className="text-[11px] text-dark/50 uppercase tracking-widest font-bold mb-1">Birth Time</p>
                <p className="text-lg font-medium text-dark">{selectedRequest.tob}</p>
              </div>
              <div>
                <p className="text-[11px] text-dark/50 uppercase tracking-widest font-bold mb-1">Birth Place</p>
                <p className="text-lg font-medium text-dark">{selectedRequest.pob}</p>
              </div>
              <div className="pt-4 border-t border-gold/10">
                <p className="text-[11px] text-dark/50 uppercase tracking-widest font-bold mb-2">Question / Notes</p>
                <p className="text-sm text-dark/80 bg-gold/5 p-4 rounded-xl leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto custom-scrollbar">
                  {selectedRequest.question}
                </p>
              </div>
              <div className="pt-4 border-t border-gold/10 flex items-center justify-between">
                <p className="text-[11px] text-dark/50 uppercase tracking-widest font-bold">Status</p>
                <button
                  onClick={() => updateStatus(selectedRequest.id, selectedRequest.status)}
                  className={`px-4 py-2 text-sm rounded-full font-bold transition-colors shadow-sm ${
                    selectedRequest.status === 'Done' 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  }`}
                >
                  {selectedRequest.status || 'Pending'}
                </button>
              </div>
            </div>
            
            {/* Right side: Photos */}
            <div className="lg:col-span-8 space-y-6">
              <h3 className="text-2xl font-serif font-bold text-dark border-b border-gold/10 pb-4">
                Palm Photos
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Photo 1 */}
                <div className="flex flex-col space-y-3">
                  <span className="text-base font-semibold text-dark/70 uppercase tracking-wide">Left Palm</span>
                  {selectedRequest.palm_photo_url ? (
                    <div className="bg-white p-2 rounded-3xl shadow-sm border border-gold/20 flex items-center justify-center">
                      <img 
                        src={selectedRequest.palm_photo_url} 
                        alt="Left Palm" 
                        className="w-full h-auto object-contain rounded-2xl"
                      />
                    </div>
                  ) : (
                    <div className="bg-white p-8 rounded-3xl border-2 border-gold/20 border-dashed text-center text-dark/40 flex flex-col items-center justify-center h-[400px]">
                      <span className="text-6xl mb-4 opacity-50">🖐️</span>
                      <p className="text-lg font-medium">Not Provided</p>
                    </div>
                  )}
                </div>

                {/* Photo 2 */}
                <div className="flex flex-col space-y-3">
                  <span className="text-base font-semibold text-dark/70 uppercase tracking-wide">Right Palm</span>
                  {selectedRequest.palm_photo_url_2 ? (
                    <div className="bg-white p-2 rounded-3xl shadow-sm border border-gold/20 flex items-center justify-center">
                      <img 
                        src={selectedRequest.palm_photo_url_2} 
                        alt="Right Palm" 
                        className="w-full h-auto object-contain rounded-2xl"
                      />
                    </div>
                  ) : (
                    <div className="bg-white p-8 rounded-3xl border-2 border-gold/20 border-dashed text-center text-dark/40 flex flex-col items-center justify-center h-[400px]">
                      <span className="text-6xl mb-4 opacity-50">🖐️</span>
                      <p className="text-lg font-medium">Not Provided</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // --- MAIN TABLE VIEW ---
  return (
    <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 mt-10 relative z-10 animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-dark">Consultation Requests</h1>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-dark/40" />
              <input
                type="text"
                placeholder="Search name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 sm:py-2 rounded-xl bg-white border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/50 w-full sm:w-64"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={exportToCSV}
                className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-2 bg-white border border-gold/20 text-dark rounded-xl hover:bg-gold/5 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gold/10 border-b border-gold/20">
                  <th className="px-6 py-4 font-serif font-semibold text-dark">Name</th>
                  <th className="px-6 py-4 font-serif font-semibold text-dark">Contact</th>
                  <th className="px-6 py-4 font-serif font-semibold text-dark">Birth Details</th>
                  <th className="px-6 py-4 font-serif font-semibold text-dark">Status</th>
                  <th className="px-6 py-4 font-serif font-semibold text-dark text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-dark/50">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                      Loading requests...
                    </td>
                  </tr>
                ) : filteredConsultations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-dark/50">
                      No consultation requests found.
                    </td>
                  </tr>
                ) : (
                  filteredConsultations.map((request) => (
                    <tr key={request.id} className="border-b border-gold/10 hover:bg-white/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-dark">{request.full_name}</div>
                        <div className="text-xs text-dark/50 mt-1">{new Date(request.created_at).toLocaleDateString()}</div>
                        {request.consent_accepted && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full mt-2">
                            <CheckCircle className="w-3 h-3" /> Consent: Yes
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {request.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-dark/80 space-y-1">
                        <div><span className="font-medium">DOB:</span> {request.dob}</div>
                        <div><span className="font-medium">Time:</span> {request.tob}</div>
                        <div><span className="font-medium">Place:</span> {request.pob}</div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => updateStatus(request.id, request.status)}
                          className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                            request.status === 'Done' 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          }`}
                        >
                          {request.status || 'Pending'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 sm:gap-3">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gold-dark bg-gold/10 hover:bg-gold/20 rounded-xl transition-colors flex items-center gap-1 sm:gap-2 shadow-sm whitespace-nowrap"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">View Details</span>
                            <span className="sm:hidden">View</span>
                          </button>
                          <button
                            onClick={() => deleteEntry(request.id)}
                            className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors shadow-sm"
                            title="Delete Request"
                          >
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
