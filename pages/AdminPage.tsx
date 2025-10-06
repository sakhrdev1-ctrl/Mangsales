import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { User } from '../types';


// --- AddUserModal Component ---
interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, 'id'>) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onSave }) => {
    const { t } = useAppContext();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<'admin' | 'rep'>('rep');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setName('');
            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setRole('rep');
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError(t('passwords_do_not_match'));
            return;
        }
        setError('');
        onSave({ name, username, password, role });
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 z-50" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('add_user')}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('name')}</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">{t('username')}</label>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">{t('password')}</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">{t('confirm_password')}</label>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                     <div>
                        <label className="block text-sm font-medium text-gray-700">{t('user_role')}</label>
                        <select value={role} onChange={e => setRole(e.target.value as 'admin' | 'rep')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                            <option value="rep">{t('rep')}</option>
                            <option value="admin">{t('admin')}</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{t('cancel')}</button>
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">{t('save_changes')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- EditUserModal Component ---
interface EditUserModalProps {
  user: User | null;
  onClose: () => void;
  onSave: (userId: number, data: Partial<User>) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user: userToEdit, onClose, onSave }) => {
    const { t } = useAppContext();
    const [name, setName] = useState('');
    const [role, setRole] = useState<'admin' | 'rep'>('rep');
    const [password, setPassword] = useState('');


    useEffect(() => {
        if (userToEdit) {
            setName(userToEdit.name);
            setRole(userToEdit.role);
            setPassword(''); // Reset password field on user change
        }
    }, [userToEdit]);

    if (!userToEdit) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(userToEdit.id, { name, role, password });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 z-50" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('edit_user')}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('name')}</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">{t('username')}</label>
                        <input type="text" value={userToEdit.username} readOnly className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">{t('user_role')}</label>
                        <select value={role} onChange={e => setRole(e.target.value as 'admin' | 'rep')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                            <option value="rep">{t('rep')}</option>
                            <option value="admin">{t('admin')}</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('new_password')}</label>
                        <input type="password" placeholder="********" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                         <p className="text-xs text-gray-500 mt-1">{t('new_password')}</p>
                    </div>
                    <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{t('cancel')}</button>
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">{t('save_changes')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- AdminPage Component ---
export const AdminPage: React.FC = () => {
    const { t, user, users, updateUser, addUser, removeUser } = useAppContext();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    
    const handleAddUserClick = () => {
        setIsAddModalOpen(true);
    };
    
    const handleEditUserClick = (userToEdit: User) => {
        setSelectedUser(userToEdit);
        setIsEditModalOpen(true);
    };

    const handleCloseModals = () => {
        setIsEditModalOpen(false);
        setIsAddModalOpen(false);
        setSelectedUser(null);
    };
    
    const handleSaveEditedUser = (userId: number, data: Partial<User>) => {
        updateUser(userId, data);
        handleCloseModals();
    };
    
    const handleSaveNewUser = (userToAdd: Omit<User, 'id'>) => {
        addUser(userToAdd);
        handleCloseModals();
    };

    const handleDeleteUser = useCallback((userToDelete: User) => {
        if (user?.id === userToDelete.id) {
            alert(t('cannot_delete_yourself'));
            return;
        }
        if (window.confirm(t('confirm_delete_user').replace('{user}', userToDelete.name))) {
            removeUser(userToDelete.id);
        }
    }, [user, t, removeUser]);
    
    return (
        <>
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{t('user_management')}</h2>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <button onClick={handleAddUserClick} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                            {t('add_user')}
                        </button>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('name')}</th>
                                <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('username')}</th>
                                <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('role')}</th>
                                <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map(userItem => (
                                <tr key={userItem.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{userItem.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{userItem.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${userItem.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        {t(userItem.role)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 rtl:space-x-reverse">
                                        <button onClick={() => handleEditUserClick(userItem)} className="text-primary-600 hover:text-primary-900">{t('edit')}</button>
                                        <button onClick={() => handleDeleteUser(userItem)} className="text-red-600 hover:text-red-900">{t('delete')}</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <EditUserModal
                user={selectedUser}
                onClose={handleCloseModals}
                onSave={handleSaveEditedUser}
            />
            
            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={handleCloseModals}
                onSave={handleSaveNewUser}
            />
        </>
    );
};