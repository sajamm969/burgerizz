import React, { useMemo, useState } from 'react';
import { useAuth, useData } from '../App';
import { Link } from 'react-router-dom';
import { iconComponents } from '../constants';
import { PermissionLevel, DashboardCard } from '../types';
import CardEditorModal from './CardEditorModal';

const Dashboard: React.FC = () => {
    const { currentUser, hasPermission, isCustomizer } = useAuth();
    const { dashboardCards, deleteCard, sharedNotes, collaborativeNotes, addCollaborativeNote, deleteCollaborativeNote } = useData();
    const [editMode, setEditMode] = useState(false);
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);
    const [editingCard, setEditingCard] = useState<DashboardCard | null>(null);
    const [newNoteContent, setNewNoteContent] = useState('');

    const cardsToDisplay = useMemo(() => {
        return dashboardCards.filter(card => 
            !card.adminOnly || (card.adminOnly && hasPermission(PermissionLevel.ADMIN))
        );
    }, [dashboardCards, hasPermission]);
    
    const handleAddClick = () => {
        setEditingCard(null);
        setIsCardModalOpen(true);
    };

    const handleEditClick = (card: DashboardCard) => {
        setEditingCard(card);
        setIsCardModalOpen(true);
    };
    
    const handleDeleteClick = (cardId: string) => {
        if(window.confirm('هل أنت متأكد من رغبتك في حذف هذه البطاقة؟')) {
            deleteCard(cardId);
        }
    };

    const handleAddNote = (e: React.FormEvent) => {
        e.preventDefault();
        if(newNoteContent.trim()){
            addCollaborativeNote(newNoteContent.trim());
            setNewNoteContent('');
        }
    }

    const renderCard = (card: DashboardCard) => {
        const IconComponent = iconComponents[card.icon] || iconComponents.SheetIcon;
        const cardContent = (
            <div className="relative block p-8 h-full bg-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-300 group">
                {editMode && (
                     <div className="absolute top-2 left-2 flex space-x-1 space-x-reverse opacity-50 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.preventDefault(); handleEditClick(card); }} className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-700">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>
                        </button>
                        <button onClick={(e) => { e.preventDefault(); handleDeleteClick(card.id); }} className="p-1 bg-red-500 text-white rounded-full hover:bg-red-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                )}
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <IconComponent className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{card.title}</h2>
                <p className="text-gray-500">{card.desc}</p>
            </div>
        );

        return card.path.startsWith('http') 
            ? <a href={card.path} target="_blank" rel="noopener noreferrer" key={card.id}>{cardContent}</a>
            : <Link to={card.path} key={card.id}>{cardContent}</Link>;
    };

    return (
        <div className="container mx-auto space-y-8">
            <div className="p-6 bg-white rounded-lg shadow-md border-r-4 border-blue-500 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">أهلاً بك، {currentUser?.username}!</h1>
                    <p className="mt-2 text-gray-600">هذه هي لوحة التحكم الرئيسية لنظام PRP. من هنا يمكنك الوصول إلى جميع أقسام النظام.</p>
                </div>
                {isCustomizer() && (
                    <div className="flex items-center">
                        <label htmlFor="editModeToggle" className="ml-4 text-sm font-medium text-gray-700">وضع التعديل</label>
                        <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="editModeToggle" id="editModeToggle" checked={editMode} onChange={() => setEditMode(!editMode)} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                            <label htmlFor="editModeToggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 bg-yellow-50 border-r-4 border-yellow-400 rounded-lg shadow-md">
                 <h2 className="text-2xl font-bold text-yellow-800 mb-2">{sharedNotes.title}</h2>
                 <p className="text-gray-700 whitespace-pre-wrap">{sharedNotes.content}</p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">ملاحظات الفريق</h2>
                <form onSubmit={handleAddNote} className="flex items-center space-x-2 space-x-reverse mb-6">
                    <input
                        type="text"
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        placeholder="أضف ملاحظة جديدة هنا..."
                        className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                        إضافة
                    </button>
                </form>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {collaborativeNotes.length > 0 ? (
                        collaborativeNotes.map(note => (
                            <div key={note.id} className="p-4 bg-gray-50 rounded-md flex justify-between items-start">
                                <div>
                                    <p className="text-gray-800">{note.content}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        بواسطة: {note.authorName} - {new Date(note.timestamp).toLocaleString('ar-EG')}
                                    </p>
                                </div>
                                {(currentUser?.id === note.authorId || hasPermission(PermissionLevel.ADMIN)) && (
                                    <button
                                        onClick={() => deleteCollaborativeNote(note.id)}
                                        className="text-red-500 hover:text-red-700 flex-shrink-0 ml-4"
                                        aria-label="حذف الملاحظة"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">لا توجد ملاحظات من الفريق حالياً.</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cardsToDisplay.map(card => renderCard(card))}
                 {editMode && (
                    <button onClick={handleAddClick} className="flex flex-col items-center justify-center p-8 h-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-100 hover:border-blue-500 transition-all duration-300 text-gray-500 hover:text-blue-600">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="text-xl font-bold">إضافة بطاقة جديدة</span>
                    </button>
                )}
            </div>
            {isCardModalOpen && <CardEditorModal card={editingCard} onSave={() => setIsCardModalOpen(false)} onClose={() => setIsCardModalOpen(false)} />}
             <style>{`
                .toggle-checkbox:checked { right: 0; border-color: #3b82f6; }
                .toggle-checkbox:checked + .toggle-label { background-color: #3b82f6; }
            `}</style>
        </div>
    );
};

export default Dashboard;
