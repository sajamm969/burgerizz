import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Link, Outlet, Navigate, useLocation } from 'react-router-dom';
import { User, PermissionLevel, Sheet, AuditLogEntry, DashboardCard, ThemeSettings, SharedNotes, CollaborativeNote } from './types';
import { INITIAL_USERS, INITIAL_SHEETS, INITIAL_DASHBOARD_CARDS, INITIAL_THEME_SETTINGS, INITIAL_SHARED_NOTES, INITIAL_COLLABORATIVE_NOTES, DashboardIcon, SheetIcon, AdminIcon, LogoutIcon } from './constants';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SheetView from './components/SheetView';
import AdminPanel from './components/AdminPanel';
import ThemeCustomizer from './components/ThemeCustomizer';

// App Data Structure
interface AppData {
    users: User[];
    sheets: Sheet[];
    auditLog: AuditLogEntry[];
    dashboardCards: DashboardCard[];
    themeSettings: ThemeSettings;
    sharedNotes: SharedNotes;
    collaborativeNotes: CollaborativeNote[];
}

// Contexts
interface AuthContextType {
    currentUser: User | null;
    login: (username: string, password: string) => boolean;
    logout: () => void;
    hasPermission: (level: PermissionLevel) => boolean;
    isCustomizer: () => boolean;
}

interface DataContextType {
    sheets: Sheet[];
    users: User[];
    auditLog: AuditLogEntry[];
    dashboardCards: DashboardCard[];
    themeSettings: ThemeSettings;
    sharedNotes: SharedNotes;
    collaborativeNotes: CollaborativeNote[];
    updateCell: (sheetId: string, rowIndex: number, cellIndex: number, value: string) => void;
    addColumn: (sheetId: string, columnName: string) => void;
    updateUser: (user: User) => void;
    addUser: (user: User) => void;
    deleteUser: (userId: string) => void;
    addCard: (card: Omit<DashboardCard, 'id'>) => void;
    updateCard: (card: DashboardCard) => void;
    deleteCard: (cardId: string) => void;
    updateTheme: (settings: ThemeSettings) => void;
    updateSharedNotes: (notes: SharedNotes) => void;
    addCollaborativeNote: (content: string) => void;
    deleteCollaborativeNote: (noteId: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const DataContext = createContext<DataContextType | null>(null);

export const useAuth = () => useContext(AuthContext)!;
export const useData = () => useContext(DataContext)!;

// Main App Component with State Management
const App: React.FC = () => {
    const [appData, setAppData] = useState<AppData>(() => {
        const defaultData = { 
            users: INITIAL_USERS, 
            sheets: INITIAL_SHEETS, 
            auditLog: [],
            dashboardCards: INITIAL_DASHBOARD_CARDS,
            themeSettings: INITIAL_THEME_SETTINGS,
            sharedNotes: INITIAL_SHARED_NOTES,
            collaborativeNotes: INITIAL_COLLABORATIVE_NOTES,
        };
        try {
            const storedData = localStorage.getItem('prpAppData');
            if (storedData) {
                const parsedData = JSON.parse(storedData);

                // Merge sheets: add new sheets from constants if not in storage
                const existingSheetIds = new Set(parsedData.sheets.map((s: Sheet) => s.id));
                const missingSheets = INITIAL_SHEETS.filter(is => !existingSheetIds.has(is.id));
                if (missingSheets.length > 0) {
                    parsedData.sheets = [...parsedData.sheets, ...missingSheets];
                }

                // Merge cards: add new cards from constants if not in storage
                const cardsFromStorage = parsedData.dashboardCards || [];
                const existingCardIds = new Set(cardsFromStorage.map((c: DashboardCard) => c.id));
                const missingCards = INITIAL_DASHBOARD_CARDS.filter(ic => !existingCardIds.has(ic.id));
                if (missingCards.length > 0) {
                    const adminCardIndex = cardsFromStorage.findIndex((c: DashboardCard) => c.adminOnly);
                    if (adminCardIndex !== -1) {
                        cardsFromStorage.splice(adminCardIndex, 0, ...missingCards);
                        parsedData.dashboardCards = cardsFromStorage;
                    } else {
                        parsedData.dashboardCards = [...cardsFromStorage, ...missingCards];
                    }
                } else {
                    parsedData.dashboardCards = cardsFromStorage;
                }
                
                parsedData.users = parsedData.users.map((u: User) => {
                    const initialUser = INITIAL_USERS.find(iu => iu.id === u.id);
                    return { ...u, password: initialUser?.password };
                });
                
                parsedData.themeSettings = parsedData.themeSettings || defaultData.themeSettings;
                parsedData.auditLog = parsedData.auditLog || [];
                parsedData.sharedNotes = parsedData.sharedNotes || defaultData.sharedNotes;
                parsedData.collaborativeNotes = parsedData.collaborativeNotes || defaultData.collaborativeNotes;
                return parsedData;
            }
        } catch (error) {
            console.error("Failed to parse app data from localStorage", error);
        }
        return defaultData;
    });

    const [currentUser, setCurrentUser] = useState<User | null>(() => {
         try {
            const storedUser = sessionStorage.getItem('prpCurrentUser');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            return null;
        }
    });

    useEffect(() => {
        const dataToStore = { ...appData, users: appData.users.map(({ password, ...user }) => user) };
        localStorage.setItem('prpAppData', JSON.stringify(dataToStore));
    }, [appData]);

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'prpAppData' && event.newValue) {
                setAppData(JSON.parse(event.newValue));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const addAuditLogEntry = useCallback((action: string, details: string) => {
        if (!currentUser) return;
        const newEntry: AuditLogEntry = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            user: currentUser.username,
            action,
            details,
        };
        setAppData(prevData => ({ ...prevData, auditLog: [newEntry, ...prevData.auditLog] }));
    }, [currentUser]);

    const login = (username: string, password: string): boolean => {
        const user = appData.users.find(u => u.username === username && u.password === password);
        if (user) {
            setCurrentUser(user);
            sessionStorage.setItem('prpCurrentUser', JSON.stringify(user));
            addAuditLogEntry('تسجيل الدخول', `المستخدم ${username} قام بتسجيل الدخول.`);
            return true;
        }
        return false;
    };

    const logout = () => {
        if(currentUser) {
            addAuditLogEntry('تسجيل الخروج', `المستخدم ${currentUser.username} قام بتسجيل الخروج.`);
        }
        setCurrentUser(null);
        sessionStorage.removeItem('prpCurrentUser');
    };

    const hasPermission = (level: PermissionLevel): boolean => {
        if (!currentUser) return false;
        const hierarchy = [PermissionLevel.READ_ONLY, PermissionLevel.DATA_ENTRY, PermissionLevel.EDITOR, PermissionLevel.ADMIN];
        return hierarchy.indexOf(currentUser.permissions) >= hierarchy.indexOf(level);
    };

    const isCustomizer = (): boolean => currentUser?.username === 'Saja.122';

    const updateCell = (sheetId: string, rowIndex: number, cellIndex: number, value: string) => {
        setAppData(prevData => {
            const newSheets = prevData.sheets.map(sheet => {
                if (sheet.id === sheetId) {
                    const newRows = [...sheet.rows];
                    newRows[rowIndex].cells[cellIndex].value = value;
                    return { ...sheet, rows: newRows };
                }
                return sheet;
            });
            return { ...prevData, sheets: newSheets };
        });
        const sheetTitle = appData.sheets.find(s => s.id === sheetId)?.title || sheetId;
        addAuditLogEntry('تحديث خلية', `قام بتحديث الخلية [${rowIndex + 1}, ${cellIndex + 1}] في شيت "${sheetTitle}" إلى القيمة "${value}".`);
    };

    const addColumn = (sheetId: string, columnName: string) => {
        setAppData(prevData => {
            const newSheets = prevData.sheets.map(sheet => {
                if (sheet.id === sheetId) {
                    const newHeaders = [...sheet.headers, columnName];
                    const newRows = sheet.rows.map((row, rowIndex) => ({
                        ...row,
                        cells: [
                            ...row.cells,
                            { id: `cell-${rowIndex}-${sheet.headers.length}`, value: '' }
                        ]
                    }));
                    return { ...sheet, headers: newHeaders, rows: newRows };
                }
                return sheet;
            });
            return { ...prevData, sheets: newSheets };
        });
        const sheetTitle = appData.sheets.find(s => s.id === sheetId)?.title || sheetId;
        addAuditLogEntry('إضافة خانة', `قام بإضافة خانة جديدة باسم "${columnName}" في شيت "${sheetTitle}".`);
    };
    
    // User Management
    const addUser = (user: User) => {
        setAppData(prev => ({...prev, users: [...prev.users, user]}));
        addAuditLogEntry('إضافة مستخدم', `تم إضافة المستخدم الجديد ${user.username}`);
    };
    const updateUser = (updatedUser: User) => {
        setAppData(prev => ({...prev, users: prev.users.map(u => u.id === updatedUser.id ? updatedUser : u)}));
        addAuditLogEntry('تحديث مستخدم', `تم تحديث بيانات المستخدم ${updatedUser.username}`);
    };
    const deleteUser = (userId: string) => {
        const userToDelete = appData.users.find(u => u.id === userId);
        setAppData(prev => ({...prev, users: prev.users.filter(u => u.id !== userId)}));
        if(userToDelete) { addAuditLogEntry('حذف مستخدم', `تم حذف المستخدم ${userToDelete.username}`); }
    };
    
    // Card Management
    const addCard = (card: Omit<DashboardCard, 'id'>) => {
        const newCard = { ...card, id: `card-${Date.now()}` };
        setAppData(prev => ({ ...prev, dashboardCards: [...prev.dashboardCards, newCard] }));
        addAuditLogEntry('إضافة بطاقة', `أضاف بطاقة "${card.title}" إلى لوحة التحكم.`);
    };
    const updateCard = (updatedCard: DashboardCard) => {
        setAppData(prev => ({ ...prev, dashboardCards: prev.dashboardCards.map(c => c.id === updatedCard.id ? updatedCard : c) }));
        addAuditLogEntry('تحديث بطاقة', `حدّث بطاقة "${updatedCard.title}" في لوحة التحكم.`);
    };
    const deleteCard = (cardId: string) => {
        const cardToDelete = appData.dashboardCards.find(c => c.id === cardId);
        setAppData(prev => ({ ...prev, dashboardCards: prev.dashboardCards.filter(c => c.id !== cardId) }));
        if(cardToDelete) { addAuditLogEntry('حذف بطاقة', `حذف بطاقة "${cardToDelete.title}" من لوحة التحكم.`); }
    };

    // Theme Management
    const updateTheme = (settings: ThemeSettings) => {
        setAppData(prev => ({ ...prev, themeSettings: settings }));
        addAuditLogEntry('تحديث المظهر', `قام بتغيير إعدادات مظهر الواجهة.`);
    };
    
    // Shared Notes Management
    const updateSharedNotes = (notes: SharedNotes) => {
        setAppData(prev => ({ ...prev, sharedNotes: notes }));
        addAuditLogEntry('تحديث الملاحظات', `قام بتحديث الملاحظات المشتركة.`);
    };

    // Collaborative Notes Management
    const addCollaborativeNote = (content: string) => {
        if (!currentUser) return;
        const newNote: CollaborativeNote = {
            id: `note-${Date.now()}`,
            content,
            authorId: currentUser.id,
            authorName: currentUser.username,
            timestamp: new Date().toISOString(),
        };
        setAppData(prev => ({ ...prev, collaborativeNotes: [newNote, ...prev.collaborativeNotes] }));
        addAuditLogEntry('إضافة ملاحظة فريق', `أضاف ملاحظة: "${content}"`);
    };

    const deleteCollaborativeNote = (noteId: string) => {
        const noteToDelete = appData.collaborativeNotes.find(n => n.id === noteId);
        setAppData(prev => ({ ...prev, collaborativeNotes: prev.collaborativeNotes.filter(n => n.id !== noteId) }));
        if(noteToDelete) {
             addAuditLogEntry('حذف ملاحظة فريق', `حذف ملاحظة: "${noteToDelete.content}"`);
        }
    };

    const authContextValue = { currentUser, login, logout, hasPermission, isCustomizer };
    const dataContextValue = { ...appData, updateCell, addColumn, addUser, updateUser, deleteUser, addCard, updateCard, deleteCard, updateTheme, updateSharedNotes, addCollaborativeNote, deleteCollaborativeNote };

    return (
        <AuthContext.Provider value={authContextValue}>
            <DataContext.Provider value={dataContextValue}>
                <HashRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/*" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                            <Route index element={<Navigate to="/dashboard" replace />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="sheet/:sheetId" element={<SheetView />} />
                            <Route path="admin" element={<AdminPanel />} />
                        </Route>
                    </Routes>
                </HashRouter>
            </DataContext.Provider>
        </AuthContext.Provider>
    );
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { currentUser } = useAuth();
    if (!currentUser) { return <Navigate to="/login" />; }
    return children;
};

// Main Layout Component
const MainLayout: React.FC = () => {
    const { currentUser, logout, hasPermission, isCustomizer } = useAuth();
    const { themeSettings } = useData();
    const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { path: "/dashboard", icon: <DashboardIcon />, label: "لوحة التحكم الرئيسية" },
        { path: "/sheet/cleanliness", icon: <SheetIcon />, label: "نظافة المطعم" },
        { path: "/sheet/orders", icon: <SheetIcon />, label: "استلام الطلبيات" },
        { path: "/sheet/training", icon: <SheetIcon />, label: "تدريب الموظفين" },
        { path: "/sheet/suppliers", icon: <SheetIcon />, label: "إدارة الموردين" },
        { path: "/sheet/maintenance", icon: <SheetIcon />, label: "إدارة الصيانة" },
        { path: "/sheet/expiry", icon: <SheetIcon />, label: "شيت الصلاحيات" },
        ...(hasPermission(PermissionLevel.ADMIN) ? [{ path: "/admin", icon: <AdminIcon />, label: "إدارة النظام" }] : [])
    ];
    
    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <aside className="w-64 flex-shrink-0 bg-gray-800 text-white flex flex-col">
                <div className="h-20 flex items-center justify-center bg-gray-900 text-2xl font-bold">بيرغرايز PRP</div>
                <nav className="flex-1 px-2 py-4 space-y-2">
                    {navLinks.map(link => (
                        <Link key={link.path} to={link.path} className={`flex items-center px-4 py-3 rounded-md text-lg transition-colors duration-200 ${location.pathname === link.path ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                            {link.icon}
                            <span className="mr-4">{link.label}</span>
                        </Link>
                    ))}
                </nav>
                 <div className="p-4 border-t border-gray-700">
                    <button onClick={logout} className="w-full flex items-center px-4 py-3 rounded-md text-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-200">
                        <LogoutIcon />
                        <span className="mr-4">تسجيل الخروج</span>
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-white shadow-md flex items-center justify-between px-8">
                    <h1 className="text-2xl font-semibold text-gray-800">{navLinks.find(l => location.pathname.startsWith(l.path))?.label || "نظام PRP"}</h1>
                    <div className="flex items-center space-x-4 space-x-reverse">
                       {isCustomizer() && (
                            <>
                                <button onClick={() => setIsNotesModalOpen(true)} className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                                    تعديل الملاحظات
                                </button>
                                <button onClick={() => setIsThemeModalOpen(true)} className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition">
                                    تخصيص الواجهة
                                </button>
                            </>
                        )}
                        <div className="text-gray-600">
                            مرحباً، <span className="font-bold text-blue-700">{currentUser?.username}</span>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-8" style={{
                    backgroundColor: themeSettings.backgroundColor,
                    backgroundImage: themeSettings.backgroundImage ? `url('${themeSettings.backgroundImage}')` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}>
                    <Outlet />
                </main>
            </div>
            {isThemeModalOpen && <ThemeCustomizer onClose={() => setIsThemeModalOpen(false)} />}
            {isNotesModalOpen && <NotesEditorModal onClose={() => setIsNotesModalOpen(false)} />}
        </div>
    );
};


// Notes Editor Modal Component
interface NotesEditorModalProps {
    onClose: () => void;
}

const NotesEditorModal: React.FC<NotesEditorModalProps> = ({ onClose }) => {
    const { sharedNotes, updateSharedNotes } = useData();
    const [notes, setNotes] = useState(sharedNotes);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNotes(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        updateSharedNotes(notes);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-lg">
                <h3 className="text-xl font-bold mb-6">تعديل الملاحظات والمهام المشتركة</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">العنوان</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={notes.title}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">المحتوى (المهام/الملاحظات)</label>
                        <textarea
                            id="content"
                            name="content"
                            value={notes.content}
                            onChange={handleChange}
                            rows={8}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-2 space-x-reverse mt-8">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition">
                        إلغاء
                    </button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                        حفظ التغييرات
                    </button>
                </div>
            </div>
        </div>
    );
};

export default App;
