import React, { useState } from 'react';
import { DashboardCard } from '../types';
import { useData } from '../App';
import { availableIcons } from '../constants';

interface CardEditorModalProps {
    card: DashboardCard | null;
    onSave: () => void;
    onClose: () => void;
}

const CardEditorModal: React.FC<CardEditorModalProps> = ({ card, onSave, onClose }) => {
    const { addCard, updateCard } = useData();
    const [formData, setFormData] = useState({
        title: card?.title || '',
        desc: card?.desc || '',
        path: card?.path || '',
        icon: card?.icon || 'SheetIcon',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (card) {
            updateCard({ ...card, ...formData });
        } else {
            addCard(formData);
        }
        onSave();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4">{card ? 'تعديل البطاقة' : 'إضافة بطاقة جديدة'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">العنوان</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">الوصف</label>
                        <textarea name="desc" value={formData.desc} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">الرابط</label>
                        <input type="text" name="path" value={formData.path} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="/sheet/sheetId or https://example.com" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">الأيقونة</label>
                        <select name="icon" value={formData.icon} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                           {availableIcons.map(iconName => (
                               <option key={iconName} value={iconName}>{iconName}</option>
                           ))}
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

export default CardEditorModal;
