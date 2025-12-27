import { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Plus, Trash2, Edit2, Check, X, Briefcase, Settings as SettingsIcon } from 'lucide-react';
import type { ClassificationLevel, TaskDefinition, TaskPriority } from '../types';
import ImportManager from '../components/admin/ImportManager';

export default function Settings() {
    // 1. Safe Context Access
    const { settings, addClassification, updateClassification, removeClassification, addTaskDefinition, removeTaskDefinition } = useCRM();

    // 2. Defensive State Initialization
    const classifications = Array.isArray(settings?.classifications) ? settings.classifications : [];
    const taskDefinitions = Array.isArray(settings?.taskDefinitions) ? settings.taskDefinitions : [];

    // Classifications State
    const [isAddingClass, setIsAddingClass] = useState(false);
    const [editingClassId, setEditingClassId] = useState<string | null>(null);
    const [newLevel, setNewLevel] = useState<Partial<ClassificationLevel>>({
        label: '',
        minSales: 0,
        color: 'bg-slate-100 text-slate-600 border-slate-200'
    });

    // Task Definitions State
    const [isAddingTaskDef, setIsAddingTaskDef] = useState(false);
    const [newTaskDef, setNewTaskDef] = useState<Omit<TaskDefinition, 'id'>>({
        title: '',
        defaultPriority: 'medium',
        daysToComplete: 1
    });

    const handleAddTaskDef = () => {
        if (!newTaskDef.title) return;
        addTaskDefinition(newTaskDef);
        setIsAddingTaskDef(false);
        setNewTaskDef({ title: '', defaultPriority: 'medium', daysToComplete: 1 });
    };

    const colors = [
        { label: 'Roxo', value: 'bg-purple-100 text-purple-700 border-purple-200' },
        { label: 'Esmeralda', value: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
        { label: 'Azul', value: 'bg-blue-100 text-blue-700 border-blue-200' },
        { label: 'Âmbar', value: 'bg-amber-100 text-amber-700 border-amber-200' },
        { label: 'Cinza', value: 'bg-slate-100 text-slate-600 border-slate-200' },
        { label: 'Vermelho', value: 'bg-red-100 text-red-700 border-red-200' },
        { label: 'Laranja', value: 'bg-orange-100 text-orange-700 border-orange-200' },
        { label: 'Indigo', value: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    ];

    const handleAddClass = () => {
        if (!newLevel.label || newLevel.minSales === undefined) return;
        addClassification({
            label: newLevel.label,
            minSales: Number(newLevel.minSales),
            color: newLevel.color || colors[4].value
        } as Omit<ClassificationLevel, 'id'>);
        setIsAddingClass(false);
        setNewLevel({ label: '', minSales: 0, color: colors[4].value });
    };

    const handleUpdateClass = (id: string, updates: Partial<ClassificationLevel>) => {
        updateClassification(id, updates);
        setEditingClassId(null);
    };

    const [activeTab, setActiveTab] = useState<'system' | 'data'>('system');

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
                    <p className="text-slate-500">Gerir classificações e definições do sistema</p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                    <button
                        onClick={() => setActiveTab('system')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'system' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <SettingsIcon className="w-4 h-4" /> Configurações
                    </button>
                    <button
                        onClick={() => setActiveTab('data')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'data' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Briefcase className="w-4 h-4" /> Gestão de Dados
                    </button>
                </div>
            </div>

            {activeTab === 'system' ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

                    {/* Classifications Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h2 className="font-semibold text-slate-900">Níveis de Classificação</h2>
                                <p className="text-sm text-slate-500">Defina os níveis de clientes baseados em vendas</p>
                            </div>
                            <button
                                onClick={() => setIsAddingClass(true)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Adicionar Nível
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3">Etiqueta</th>
                                        <th className="px-6 py-3">Vendas Mínimas</th>
                                        <th className="px-6 py-3">Cor</th>
                                        <th className="px-6 py-3 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {/* Add Form */}
                                    {isAddingClass && (
                                        <tr className="bg-primary-50/50">
                                            <td className="px-6 py-4">
                                                <input
                                                    type="text"
                                                    placeholder="Nome do nível"
                                                    className="w-full px-2 py-1 border border-slate-200 rounded text-sm"
                                                    value={newLevel.label}
                                                    onChange={e => setNewLevel({ ...newLevel, label: e.target.value })}
                                                    autoFocus
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    className="w-full px-2 py-1 border border-slate-200 rounded text-sm"
                                                    value={newLevel.minSales}
                                                    onChange={e => setNewLevel({ ...newLevel, minSales: Number(e.target.value) })}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-1 flex-wrap w-40">
                                                    {colors.map(c => (
                                                        <button
                                                            key={c.label}
                                                            className={`w - 4 h - 4 rounded - full border ${c.value.split(' ')[0]} ${newLevel.color === c.value ? 'ring-2 ring-primary-500 ring-offset-1' : ''} `}
                                                            onClick={() => setNewLevel({ ...newLevel, color: c.value })}
                                                            title={c.label}
                                                        />
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={handleAddClass} className="p-1 text-green-600 hover:bg-green-50 rounded">
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => setIsAddingClass(false)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {[...classifications].sort((a, b) => b.minSales - a.minSales).map((level) => (
                                        <tr key={level.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {editingClassId === level.id ? (
                                                    <input
                                                        type="text"
                                                        className="w-full px-2 py-1 border border-slate-200 rounded text-sm"
                                                        defaultValue={level.label}
                                                        onBlur={(e) => handleUpdateClass(level.id, { label: e.target.value })}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleUpdateClass(level.id, { label: e.currentTarget.value });
                                                        }}
                                                    />
                                                ) : (
                                                    level.label
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-slate-600">
                                                {editingClassId === level.id ? (
                                                    <input
                                                        type="number"
                                                        className="w-full px-2 py-1 border border-slate-200 rounded text-sm"
                                                        defaultValue={level.minSales}
                                                        onBlur={(e) => handleUpdateClass(level.id, { minSales: Number(e.target.value) })}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleUpdateClass(level.id, { minSales: Number(e.currentTarget.value) });
                                                        }}
                                                    />
                                                ) : (
                                                    `€ ${level.minSales.toLocaleString('pt-PT')} `
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {editingClassId === level.id ? (
                                                    <div className="flex gap-1 flex-wrap w-40">
                                                        {colors.map(c => (
                                                            <button
                                                                key={c.label}
                                                                className={`w - 4 h - 4 rounded - full border ${c.value.split(' ')[0]} ${level.color === c.value ? 'ring-2 ring-primary-500 ring-offset-1' : ''} `}
                                                                onClick={() => handleUpdateClass(level.id, { color: c.value })}
                                                                title={c.label}
                                                            />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className={`px - 2 py - 1 rounded text - xs border ${level.color} `}>
                                                        {level.label}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {editingClassId === level.id ? (
                                                        <button onClick={() => setEditingClassId(null)} className="p-1 text-primary-600 hover:bg-primary-50 rounded">
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => setEditingClassId(level.id)} className="p-1 text-slate-400 hover:text-primary-600 hover:bg-slate-100 rounded">
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => removeClassification(level.id)}
                                                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Task Definitions Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h2 className="font-semibold text-slate-900">Tipos de Tarefa</h2>
                                <p className="text-sm text-slate-500">Defina os tipos de tarefas disponíveis para os utilizadores</p>
                            </div>
                            <button
                                onClick={() => setIsAddingTaskDef(true)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Adicionar Tipo
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3">Título</th>
                                        <th className="px-6 py-3">Prioridade Padrão</th>
                                        <th className="px-6 py-3">Prazo (Dias)</th>
                                        <th className="px-6 py-3 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {/* Add Form Task Def */}
                                    {isAddingTaskDef && (
                                        <tr className="bg-primary-50/50">
                                            <td className="px-6 py-4">
                                                <input
                                                    type="text"
                                                    placeholder="Ex: Ligar ao Cliente"
                                                    className="w-full px-2 py-1 border border-slate-200 rounded text-sm"
                                                    value={newTaskDef.title}
                                                    onChange={e => setNewTaskDef({ ...newTaskDef, title: e.target.value })}
                                                    autoFocus
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    className="w-full px-2 py-1 border border-slate-200 rounded text-sm bg-white"
                                                    value={newTaskDef.defaultPriority}
                                                    onChange={e => setNewTaskDef({ ...newTaskDef, defaultPriority: e.target.value as TaskPriority })}
                                                >
                                                    <option value="low">Baixa</option>
                                                    <option value="medium">Média</option>
                                                    <option value="high">Alta</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span>Dias:</span>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        className="w-20 px-2 py-1 border border-slate-200 rounded text-sm"
                                                        value={newTaskDef.daysToComplete}
                                                        onChange={e => setNewTaskDef({ ...newTaskDef, daysToComplete: Number(e.target.value) })}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={handleAddTaskDef} className="p-1 text-green-600 hover:bg-green-50 rounded">
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => setIsAddingTaskDef(false)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {taskDefinitions.map((def) => (
                                        <tr key={def.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {def.title}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px - 2 py - 1 rounded text - xs border flex items - center gap - 1 w - fit
                                            ${def.defaultPriority === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                                                        def.defaultPriority === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                            'bg-blue-50 text-blue-700 border-blue-200'
                                                    } `}>
                                                    {def.defaultPriority === 'high' ? 'Alta' : def.defaultPriority === 'medium' ? 'Média' : 'Baixa'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {def.daysToComplete} dia{def.daysToComplete !== 1 && 's'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => removeTaskDefinition(def.id)}
                                                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <ImportManager />
                </div>
            )}
        </div>
    );
}
