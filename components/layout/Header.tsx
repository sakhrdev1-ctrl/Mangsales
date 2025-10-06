
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Language } from '../../types';
import { useNavigate } from 'react-router-dom';

const UserCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
);
const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.5l.053-.053a.5.5 0 01.707 0l1.414 1.414a.5.5 0 010 .707l-1.414 1.414a.5.5 0 01-.707 0l-.053-.053zM1.75 11a9.25 9.25 0 1118.5 0 9.25 9.25 0 01-18.5 0z" /></svg>
);

export const Header: React.FC = () => {
    const { user, logout, language, setLanguage, t } = useAppContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleLanguage = () => {
        setLanguage(language === Language.EN ? Language.AR : Language.EN);
    };

    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <div>
                {/* Potentially add breadcrumbs or page title here */}
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <button
                    onClick={toggleLanguage}
                    className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600 hover:text-primary-600 focus:outline-none"
                    aria-label="Toggle Language"
                >
                    <GlobeIcon />
                    <span className="font-semibold">{language === Language.EN ? 'AR' : 'EN'}</span>
                </button>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <UserCircleIcon />
                    <div className="text-right rtl:text-left">
                        <div className="font-semibold text-gray-800">{user?.name}</div>
                        <div className="text-sm text-gray-500 capitalize">{t(user?.role || 'rep')}</div>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 rtl:space-x-reverse text-red-500 hover:text-red-700 focus:outline-none"
                    aria-label="Logout"
                >
                    <LogoutIcon />
                    <span>{t('logout')}</span>
                </button>
            </div>
        </header>
    );
};
