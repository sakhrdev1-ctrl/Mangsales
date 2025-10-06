import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { ClientType, VisitPurpose, Visit } from '../types';

export const DataEntryPage: React.FC = () => {
    const { t, user, addVisit, visits } = useAppContext();
    const { data: location, loading, error: geoError, getLocation } = useGeolocation();
    
    useEffect(() => {
        // We only need location for new clients, so call it when component mounts
        // and it will be ready if the user selects 'new'
        getLocation();
    }, [getLocation]);

    const [visitDate, setVisitDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [clientName, setClientName] = useState<string>('');
    const [employeeName, setEmployeeName] = useState<string>('');
    const [employeePhone, setEmployeePhone] = useState<string>('');
    const [companyEmail, setCompanyEmail] = useState<string>('');
    const [clientType, setClientType] = useState<ClientType>(ClientType.NEW);
    const [visitPurposes, setVisitPurposes] = useState<VisitPurpose[]>([]);
    const [notes, setNotes] = useState<string>('');
    const [formMessage, setFormMessage] = useState<string>('');
    
    const clientDataMap = useMemo(() => {
        if (!visits) return new Map<string, Visit>();

        const clientMap = new Map<string, Visit>();

        // Find the latest visit for each client to get their most recent data
        for (const visit of visits) {
            const existingVisit = clientMap.get(visit.clientName);
            if (!existingVisit || new Date(visit.visitDate) > new Date(existingVisit.visitDate)) {
                clientMap.set(visit.clientName, visit);
            }
        }
        return clientMap;
    }, [visits]);

    const existingClients = useMemo(() => {
        return Array.from(clientDataMap.keys()).sort();
    }, [clientDataMap]);

    // Reset client-related fields when switching between new/old
    useEffect(() => {
        setClientName('');
        setEmployeeName('');
        setEmployeePhone('');
        setCompanyEmail('');
    }, [clientType]);
    
    const handleClientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setClientName(name);

        // Autofill data if the entered name matches an existing client
        const clientData = clientDataMap.get(name);
        if (clientData) {
            setEmployeeName(clientData.employeeName);
            setEmployeePhone(clientData.employeePhone);
            setCompanyEmail(clientData.companyEmail);
        }
    };


    const handlePurposeChange = (purpose: VisitPurpose) => {
        setVisitPurposes(prev => 
            prev.includes(purpose) 
            ? prev.filter(p => p !== purpose)
            : [...prev, purpose]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        
        // Find the latest visit for the client to determine if they are truly new, or just new to this rep
        const latestVisit = clientDataMap.get(clientName);
        const finalClientType = latestVisit ? ClientType.OLD : ClientType.NEW;

        addVisit({
            repId: user.id,
            repName: user.name,
            visitDate,
            clientName,
            employeeName,
            employeePhone,
            companyEmail,
            clientLocation: finalClientType === ClientType.NEW ? location : null,
            clientType: finalClientType,
            visitPurposes,
            notes,
        });
        
        setFormMessage(t('visit_added_successfully'));
        // Reset form
        setClientName('');
        setEmployeeName('');
        setEmployeePhone('');
        setCompanyEmail('');
        setNotes('');
        setVisitPurposes([]);
        setClientType(ClientType.NEW); // Default back to new

        setTimeout(() => setFormMessage(''), 3000);
    };
    
    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('new_visit_report')}</h2>
            
            {formMessage && <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg">{formMessage}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('visit_date')}</label>
                    <input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700">{t('client_type')}</label>
                    <div className="mt-2 flex space-x-4 rtl:space-x-reverse">
                        {Object.values(ClientType).map(type => (
                             <label key={type} className="inline-flex items-center">
                                <input type="radio" name="clientType" value={type} checked={clientType === type} onChange={() => setClientType(type)} className="form-radio text-primary-600 focus:ring-primary-500" />
                                <span className="mx-2 text-gray-700 capitalize">{t(type)}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('client_name')}</label>
                        {clientType === ClientType.NEW ? (
                           <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                        ) : (
                            <>
                               <input 
                                    type="text" 
                                    list="clients-list"
                                    value={clientName} 
                                    onChange={handleClientNameChange} 
                                    required 
                                    placeholder={t('client_name_placeholder_old')}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                                <datalist id="clients-list">
                                    {existingClients.map(name => <option key={name} value={name} />)}
                                </datalist>
                            </>
                        )}
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">{t('employee_name')}</label>
                        <input type="text" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                </div>
                
                {clientType === ClientType.NEW && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('client_location')}</label>
                        <div className="mt-1 p-2 border border-gray-200 rounded-md bg-gray-50 min-h-[42px] flex items-center">
                            {loading && <p className="text-gray-500 text-sm">{t('fetching_location')}</p>}
                            {geoError && <p className="text-red-500 text-sm">{t('location_error')}</p>}
                            {location && <p className="text-green-600 text-sm">{t('location_success')}: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</p>}
                        </div>
                    </div>
                )}


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('employee_phone')}</label>
                        <input type="tel" value={employeePhone} onChange={(e) => setEmployeePhone(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">{t('company_email')}</label>
                        <input type="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('purpose_of_visit')}</label>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.values(VisitPurpose).map(purpose => (
                            <label key={purpose} className="inline-flex items-center">
                                <input type="checkbox" checked={visitPurposes.includes(purpose)} onChange={() => handlePurposeChange(purpose)} className="form-checkbox rounded text-primary-600 focus:ring-primary-500" />
                                <span className="mx-2 text-gray-700 capitalize">{t(purpose)}</span>
                            </label>
                        ))}
                    </div>
                </div>
                
                 <div>
                    <label className="block text-sm font-medium text-gray-700">{t('notes')}</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"></textarea>
                </div>
                
                <div className="flex justify-end pt-4">
                    <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        {t('submit')}
                    </button>
                </div>

            </form>
        </div>
    );
};