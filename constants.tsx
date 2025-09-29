import React from 'react';
import { User, PermissionLevel, Sheet, DashboardCard, ThemeSettings, SharedNotes, CollaborativeNote } from './types';

export const INITIAL_USERS: User[] = [
  { id: 'user-1', username: 'Ahmad.122', password: 'ahmad217', permissions: PermissionLevel.DATA_ENTRY },
  { id: 'user-2', username: 'Saja.122', password: 'saja155', permissions: PermissionLevel.ADMIN },
  { id: 'user-3', username: 'khaled.122', password: 'khaled.256', permissions: PermissionLevel.DATA_ENTRY },
  { id: 'admin-1', username: 'admin', password: 'admin', permissions: PermissionLevel.ADMIN },
];

const createInitialSheet = (id: string, title: string, headers: string[]): Sheet => ({
  id,
  title,
  headers,
  rows: Array.from({ length: 20 }).map((_, rowIndex) => ({
    id: `row-${rowIndex}`,
    cells: headers.map((__, cellIndex) => ({
      id: `cell-${rowIndex}-${cellIndex}`,
      value: '',
    })),
  })),
});

export const INITIAL_SHEETS: Sheet[] = [
  createInitialSheet('cleanliness', 'نظافة المطعم', ['المهمة', 'المسؤول', 'الوقت المحدد', 'الحالة', 'ملاحظات']),
  createInitialSheet('orders', 'استلام الطلبيات', ['المنتج', 'المورد', 'الكمية المستلمة', 'تاريخ الاستلام', 'المستلم', 'رقم الفاتورة']),
  createInitialSheet('training', 'تدريب الموظفين', ['اسم الموظف', 'الدورة التدريبية', 'تاريخ البدء', 'تاريخ الانتهاء', 'النتيجة', 'المدرب']),
  createInitialSheet('suppliers', 'إدارة الموردين', ['اسم المورد', 'الكمية', 'النواقص', 'الموظف الذي استلمها', 'المشرف', 'حالة الطلبية']),
  createInitialSheet('maintenance', 'إدارة الصيانة', ['التاريخ', 'المعدات', 'نوع الصيانة (وقائية او طارئة)', 'الموظف المسؤول', 'تاريخ التبليغ', 'تاريخ اغلاق الصيانة', 'ملاحظات']),
  createInitialSheet('expiry', 'شيت الصلاحيات', ['المنتج', 'الصلاحية 1', 'الصلاحية 2', 'الصلاحية 3', 'ملاحظات']),
];

// Icons
export const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

export const SheetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

export const AdminIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

export const INITIAL_DASHBOARD_CARDS: DashboardCard[] = [
    { id: 'card-1', title: "نظافة المطعم", path: "/sheet/cleanliness", icon: "SheetIcon", desc: "تتبع مهام النظافة اليومية والأسبوعية." },
    { id: 'card-2', title: "استلام الطلبيات", path: "/sheet/orders", icon: "SheetIcon", desc: "سجل واردات المخزون والطلبيات من الموردين." },
    { id: 'card-3', title: "تدريب الموظفين", path: "/sheet/training", icon: "SheetIcon", desc: "متابعة تقدم الموظفين في البرامج التدريبية." },
    { id: 'card-4', title: "إدارة الموردين", path: "/sheet/suppliers", icon: "SheetIcon", desc: "متابعة الموردين والكميات المستلمة." },
    { id: 'card-5', title: "إدارة الصيانة", path: "/sheet/maintenance", icon: "SheetIcon", desc: "سجل عمليات الصيانة الوقائية والطارئة." },
    { id: 'card-6', title: "شيت الصلاحيات", path: "/sheet/expiry", icon: "SheetIcon", desc: "تتبع تواريخ صلاحية المنتجات." },
    { id: 'card-admin', title: "إدارة النظام", path: "/admin", icon: "AdminIcon", desc: "إدارة المستخدمين والصلاحيات وسجل التغييرات.", adminOnly: true },
];

export const iconComponents: { [key: string]: React.FC<any> } = {
  SheetIcon: SheetIcon,
  AdminIcon: AdminIcon,
  DashboardIcon: DashboardIcon,
};

export const availableIcons = Object.keys(iconComponents);

export const INITIAL_THEME_SETTINGS: ThemeSettings = {
    backgroundColor: '#f3f4f6', // bg-gray-100
    backgroundImage: '',
};

export const INITIAL_SHARED_NOTES: SharedNotes = {
    title: 'ملاحظات ومهام اليوم',
    content: 'لا توجد ملاحظات حالياً. يمكنك إضافة ملاحظات من خلال الضغط على زر "تعديل الملاحظات" في الشريط العلوي (خاص بصلاحيات معينة).',
};

export const INITIAL_COLLABORATIVE_NOTES: CollaborativeNote[] = [];
