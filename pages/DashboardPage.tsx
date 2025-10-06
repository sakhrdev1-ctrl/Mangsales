import React from 'react';
import { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { BarChartComponent } from '../components/charts/BarChartComponent';
import { PieChartComponent } from '../components/charts/PieChartComponent';
import { ClientType, VisitPurpose } from '../types';

const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);


export const DashboardPage: React.FC = () => {
  const { t, user, visits, users } = useAppContext();
  
  const salesReps = useMemo(() => users.filter(u => u.role === 'rep'), [users]);
  
  const [selectedRepId, setSelectedRepId] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const filteredVisits = useMemo(() => {
    return visits.filter(visit => {
        const visitDate = new Date(visit.visitDate);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        
        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);

        const repMatch = selectedRepId === 'all' || visit.repId === Number(selectedRepId);
        const startDateMatch = !start || visitDate >= start;
        const endDateMatch = !end || visitDate <= end;

        return repMatch && startDateMatch && endDateMatch;
    });
  }, [visits, selectedRepId, startDate, endDate]);

  const searchedVisits = useMemo(() => {
      if (!searchTerm) return filteredVisits;
      const lowercasedTerm = searchTerm.toLowerCase();
      return filteredVisits.filter(visit => 
          visit.clientName.toLowerCase().includes(lowercasedTerm) ||
          visit.repName.toLowerCase().includes(lowercasedTerm) ||
          visit.notes.toLowerCase().includes(lowercasedTerm) ||
          visit.employeeName.toLowerCase().includes(lowercasedTerm)
      );
  }, [filteredVisits, searchTerm]);


  const totalVisits = filteredVisits.length;
  const newClients = filteredVisits.filter(v => v.clientType === ClientType.NEW).length;

  const repPerformanceData = useMemo(() => {
    const repsToDisplay = selectedRepId === 'all' 
      ? salesReps
      : salesReps.filter(r => r.id === Number(selectedRepId));

    return repsToDisplay.map(rep => {
      const repVisits = filteredVisits.filter(v => v.repId === rep.id);
      return {
        name: rep.name,
        [t('total_visits')]: repVisits.length,
        [t('new')]: repVisits.filter(v => v.clientType === ClientType.NEW).length,
        [t('old')]: repVisits.filter(v => v.clientType === ClientType.OLD).length,
      };
    });
  }, [salesReps, filteredVisits, t, selectedRepId]);

  const visitPurposeData = useMemo(() => {
    const purposeCounts = filteredVisits.flatMap(v => v.visitPurposes).reduce((acc, purpose) => {
        acc[purpose] = (acc[purpose] || 0) + 1;
        return acc;
    }, {} as Record<VisitPurpose, number>);

    return Object.entries(purposeCounts).map(([name, value]) => ({
      name: t(name as VisitPurpose),
      value,
    }));
  }, [filteredVisits, t]);
  
  const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560', '#775DD0', '#546E7A'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">{t('welcome_back')}, {user?.name}!</h2>
        <p className="text-gray-600 mt-1">{t('dashboard_overview')}</p>
      </div>

      <Card className="!p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">{t('filter_by_rep')}</label>
                <select value={selectedRepId} onChange={e => setSelectedRepId(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500">
                    <option value="all">{t('all_reps')}</option>
                    {salesReps.map(rep => <option key={rep.id} value={rep.id}>{rep.name}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">{t('start_date')}</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">{t('end_date')}</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
            </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-primary-500 p-6 rounded-lg shadow-lg text-white">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-lg font-semibold">{t('total_visits')}</p>
                    <p className="text-4xl font-bold">{totalVisits}</p>
                </div>
                <div className="bg-primary-600 p-3 rounded-full"><CalendarIcon/></div>
            </div>
         </div>
         <div className="bg-green-500 p-6 rounded-lg shadow-lg text-white">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-lg font-semibold">{t('new_clients')}</p>
                    <p className="text-4xl font-bold">{newClients}</p>
                </div>
                <div className="bg-green-600 p-3 rounded-full"><UsersIcon/></div>
            </div>
         </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={t('rep_performance_comparison')}>
          <BarChartComponent 
            data={repPerformanceData}
            xAxisKey="name"
            barKeys={[{ key: t('total_visits'), color: '#3b82f6' }]}
          />
        </Card>
        <Card title={t('visit_purpose_distribution')}>
           <PieChartComponent data={visitPurposeData} colors={PIE_COLORS} />
        </Card>
      </div>

      <Card title={t('client_types_by_rep')}>
        <BarChartComponent
            data={repPerformanceData}
            xAxisKey="name"
            barKeys={[
                { key: t('new'), color: '#00C49F' },
                { key: t('old'), color: '#0088FE' },
            ]}
        />
      </Card>
      
      <Card title={t('visits_data')}>
          <div className="mb-4">
              <input 
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
          </div>
          <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                  <thead className="bg-gray-50">
                      <tr>
                          <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('rep_name')}</th>
                          <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('client_name')}</th>
                          <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('employee_name')}</th>
                          <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('company_email')}</th>
                          <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('employee_phone')}</th>
                          <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('visit_date')}</th>
                          <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('client_type')}</th>
                          <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('notes')}</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                      {searchedVisits.map(visit => (
                          <tr key={visit.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{visit.repName}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{visit.clientName}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{visit.employeeName}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visit.companyEmail}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visit.employeePhone}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visit.visitDate}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{t(visit.clientType)}</td>
                              <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-sm">{visit.notes}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </Card>

    </div>
  );
};