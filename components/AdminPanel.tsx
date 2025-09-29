import React, { useState } from 'react';
import { useData, useAuth } from '../App';
import { User, PermissionLevel } from '../types';

const AdminPanel: React.FC = () => {
    const { users, auditLog, addUser, updateUser, deleteUser } = useData();
    const { hasPermission } = useAuth();
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    if (!hasPermission(PermissionLevel.ADMIN)) {
        return <div className="text-center text-red-500">ليس لديك الصلاحية للوصول إلى هذه الصفحة.</div>;
    }

    const openAddModal = () => {
        setEditingUser(null);
        setIsUserModalOpen(true);
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setIsUserModalOpen(true);
    };

    const handleUserSave = (user: User) => {
        if (editingUser) {
            updateUser(user);
        } else {
            addUser({ ...user, id: `user-${Date.now()}` });
        }
        setIsUserModalOpen(false);
    };
    
    const handleUserDelete = (userId: string) => {
        if(window.confirm('هل أنت متأكد من رغبتك في حذف هذا المستخدم؟')) {
            deleteUser(userId);
        }
    }

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">إدارة المستخدمين</h2>
                    <button onClick={openAddModal} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                        إضافة مستخدم جديد
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">اسم المستخدم</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الصلاحية</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.permissions}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2 space-x-reverse">
                                        <button onClick={() => openEditModal(user)} className="text-indigo-600 hover:text-indigo-900">تعديل</button>
                                        <button onClick={() => handleUserDelete(user.id)} className="text-red-600 hover:text-red-900">حذف</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">سجل التغييرات (Audit Log)</h2>
                <div className="overflow-y-auto h-96 border rounded-md">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">الوقت</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">المستخدم</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">الإجراء</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">التفاصيل</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {auditLog.map(log => (
                                <tr key={log.id}>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm">{new Date(log.timestamp).toLocaleString('ar-EG')}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm">{log.user}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-semibold">{log.action}</td>
                                    <td className="px-4 py-2 whitespace-normal text-sm">{log.details}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isUserModalOpen && <UserModal user={editingUser} onSave={handleUserSave} onClose={() => setIsUserModalOpen(false)} />}
        </div>
    );
};

// User Modal Component
interface UserModalProps {
    user: User | null;
    onSave: (user: User) => void;
    onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ user, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        username: user?.username || '',
        password: '',
        permissions: user?.permissions || PermissionLevel.DATA_ENTRY
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const userToSave: User = {
            id: user?.id || '',
            username: formData.username,
            permissions: formData.permissions,
        };
        // Only include password if it's a new user or password is being changed
        if(formData.password) {
            userToSave.password = formData.password;
        } else if (user?.password) {
            userToSave.password = user.password;
        }

        onSave(userToSave);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4">{user ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">اسم المستخدم</label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">كلمة المرور</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder={user ? 'اتركه فارغاً لعدم التغيير' : ''} required={!user} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">الصلاحيات</label>
                        <select name="permissions" value={formData.permissions} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            <option value={PermissionLevel.ADMIN}>مدير</option>
                            <option value={PermissionLevel.EDITOR}>محرر (إضافة خانات)</option>
                            <option value={PermissionLevel.DATA_ENTRY}>إدخال بيانات</option>
                            <option value={PermissionLevel.READ_ONLY}>قراءة فقط</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">إلغاء</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">حفظ</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminPanel;