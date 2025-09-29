import React, { useState } from 'react';
import { useData } from '../App';

interface ThemeCustomizerProps {
    onClose: () => void;
}

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ onClose }) => {
    const { themeSettings, updateTheme } = useData();
    const [settings, setSettings] = useState(themeSettings);

    const handleSave = () => {
        updateTheme(settings);
        onClose();
    };

    const handleReset = () => {
        const defaultSettings = { backgroundColor: '#f3f4f6', backgroundImage: '' };
        setSettings(defaultSettings);
        updateTheme(defaultSettings);
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md">
                <h3 className="text-xl font-bold mb-6">تخصيص مظهر الواجهة</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">لون الخلفية</label>
                        <div className="flex items-center mt-1">
                            <input
                                type="color"
                                value={settings.backgroundColor}
                                onChange={(e) => setSettings(s => ({ ...s, backgroundColor: e.target.value }))}
                                className="w-10 h-10 p-1 border border-gray-300 rounded-md cursor-pointer"
                            />
                             <input
                                type="text"
                                value={settings.backgroundColor}
                                onChange={(e) => setSettings(s => ({ ...s, backgroundColor: e.target.value }))}
                                className="mr-2 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">رابط صورة الخلفية (اختياري)</label>
                        <input
                            type="text"
                            placeholder="https://example.com/background.jpg"
                            value={settings.backgroundImage}
                            onChange={(e) => setSettings(s => ({ ...s, backgroundImage: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                </div>
                 <div className="flex justify-between items-center mt-8">
                    <button onClick={handleReset} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
                        إعادة تعيين
                    </button>
                    <div className="space-x-2 space-x-reverse">
                        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition">
                            إلغاء
                        </button>
                        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                            حفظ التغييرات
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThemeCustomizer;
