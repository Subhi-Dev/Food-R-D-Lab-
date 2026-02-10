import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Save } from 'lucide-react';

const AuditLog: React.FC = () => {
  const [ph, setPh] = useState<string>('');
  const [temp, setTemp] = useState<string>('');
  const [notes, setNotes] = useState('');
  
  const [submitted, setSubmitted] = useState(false);

  // Quality Control Thresholds
  const TARGET_PH_MIN = 6.8;
  const TARGET_PH_MAX = 7.2;

  const isPhValid = ph === '' || (parseFloat(ph) >= TARGET_PH_MIN && parseFloat(ph) <= TARGET_PH_MAX);
  const isTempValid = temp !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(ph && temp) {
        setSubmitted(true);
        // Reset after 3 seconds for demo purposes
        setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Quality Control Audit Log</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* pH Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Final pH 
                <span className="text-xs font-normal text-gray-500 ml-2">(Target: 6.8 - 7.2)</span>
            </label>
            <div className="relative">
                <input
                type="number"
                step="0.1"
                value={ph}
                onChange={(e) => setPh(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${
                    !isPhValid 
                    ? 'border-red-300 focus:ring-red-200 bg-red-50 text-red-900' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100 bg-white text-gray-900'
                }`}
                placeholder="Enter pH value"
                />
                {!isPhValid && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                )}
            </div>
            {!isPhValid && (
                <p className="mt-1 text-xs text-red-600">Warning: pH is outside the target range.</p>
            )}
          </div>

          {/* Temperature Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
            <input
              type="number"
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none bg-white text-gray-900"
              placeholder="e.g. 24.5"
            />
          </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observations / Notes</label>
            <textarea 
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none bg-white text-gray-900"
                placeholder="Enter any sensory notes or viscosity observations..."
            />
        </div>

        <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-gray-500">
                Logged by: <span className="font-medium text-gray-900">Jane Doe</span>
            </div>
            <button 
                type="submit"
                disabled={!ph || !temp}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    submitted 
                    ? 'bg-green-600 text-white' 
                    : (!ph || !temp) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
                {submitted ? <CheckCircle size={18} /> : <Save size={18} />}
                <span>{submitted ? 'Logged Successfully' : 'Save Entry'}</span>
            </button>
        </div>
      </form>

      {/* Mock History */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Logs</h4>
        <div className="space-y-3">
            <div className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-gray-600">v3.0 - Batch A2</span>
                </div>
                <div className="flex space-x-6">
                    <span className="text-gray-500">pH: <span className="font-mono text-gray-900">7.0</span></span>
                    <span className="text-gray-500">Temp: <span className="font-mono text-gray-900">22°C</span></span>
                    <span className="text-gray-400 text-xs">2 days ago</span>
                </div>
            </div>
            <div className="flex items-center justify-between text-sm p-3 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-gray-600">v2.9 - Batch F1</span>
                </div>
                <div className="flex space-x-6">
                    <span className="text-gray-500">pH: <span className="font-mono text-red-700 font-bold">6.4</span></span>
                    <span className="text-gray-500">Temp: <span className="font-mono text-gray-900">23°C</span></span>
                    <span className="text-gray-400 text-xs">5 days ago</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLog;