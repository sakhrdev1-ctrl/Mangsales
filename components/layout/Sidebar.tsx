
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const ChartBarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
);
const PlusCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const UserGroupIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
);


export const Sidebar: React.FC = () => {
    const { t, user } = useAppContext();

    const commonLinkClasses = "flex items-center space-x-3 rtl:space-x-reverse text-gray-300 p-2 rounded-md hover:bg-primary-700 hover:text-white transition-colors";
    const activeLinkClasses = "bg-primary-700 text-white";

    return (
        <aside className="w-64 bg-primary-900 text-white flex flex-col">
            <div className="p-4 border-b border-primary-800">
                <h1 className="text-2xl font-bold text-center">{t('sales_tracker_pro')}</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {user?.role === 'admin' && (
                    <NavLink to="/" className={({isActive}) => `${commonLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
                        <ChartBarIcon />
                        <span>{t('dashboard')}</span>
                    </NavLink>
                )}
                
                <NavLink to="/add-visit" className={({isActive}) => `${commonLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
                    <PlusCircleIcon />
                    <span>{t('add_visit')}</span>
                </NavLink>

                {user?.role === 'admin' && (
                    <NavLink to="/admin" className={({isActive}) => `${commonLinkClasses} ${isActive ? activeLinkClasses : ''}`}>
                        <UserGroupIcon />
                        <span>{t('admin_panel')}</span>
                    </NavLink>
                )}
            </nav>
        </aside>
    );
};