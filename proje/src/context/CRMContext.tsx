import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
    Client, Interaction, Opportunity, Sale, OpportunityStatus,
    ClassificationLevel, User, Task, TaskDefinition,
    Lead, PipelineStage, Campaign, Document
} from '../types';

interface CRMState {
    users: User[];
    currentUser: User | null;
    clients: Client[];
    leads: Lead[];
    interactions: Interaction[];
    opportunities: Opportunity[];
    pipelineStages: PipelineStage[];
    sales: Sale[];
    tasks: Task[];
    campaigns: Campaign[];
    documents: Document[];
    settings: {
        classifications: ClassificationLevel[];
        taskDefinitions: TaskDefinition[];
        pipelineStages: PipelineStage[];
    };
}

interface CRMActions {
    login: (email: string, pass: string) => boolean;
    logout: () => void;
    register: (name: string, email: string, pass: string) => boolean;
    addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
    updateClient: (id: string, updates: Partial<Client>) => void;
    deleteClient: (id: string) => void;
    addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'userId' | 'score'>) => void;
    updateLead: (id: string, updates: Partial<Lead>) => void;
    convertLead: (leadId: string) => void;
    addInteraction: (interaction: Omit<Interaction, 'id' | 'userId'>) => void;
    addOpportunity: (opportunity: Omit<Opportunity, 'id' | 'createdAt' | 'userId'>) => void;
    updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
    updateOpportunityStatus: (id: string, status: OpportunityStatus) => void;
    addSale: (sale: Omit<Sale, 'id' | 'userId'>) => void;
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'userId'>) => void;
    toggleTaskCompletion: (id: string) => void;
    deleteTask: (id: string) => void;
    addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'userId' | 'metrics'>) => void;
    addDocument: (doc: Omit<Document, 'id' | 'createdAt' | 'userId' | 'version'>) => void;
    addClassification: (classification: Omit<ClassificationLevel, 'id'>) => void;
    updateClassification: (id: string, updates: Partial<ClassificationLevel>) => void;
    removeClassification: (id: string) => void;
    addTaskDefinition: (def: Omit<TaskDefinition, 'id'>) => void;
    removeTaskDefinition: (id: string) => void;
    updatePipelineStage: (id: string, updates: Partial<PipelineStage>) => void;
    importClients: (clients: Client[]) => void;
    importFullState: (state: Partial<CRMState>) => void;
}

const CRMContext = createContext<(CRMState & CRMActions) | undefined>(undefined);

const STORAGE_KEY = 'crm-storage-v3-context';

const initialMockData = (): CRMState => {
    const adminId = 'admin-user-id';
    const pipelineStages: PipelineStage[] = [
        { id: 'ps1', name: 'Prospeção', order: 1, probability: 10, color: 'bg-slate-100' },
        { id: 'ps2', name: 'Qualificação', order: 2, probability: 25, color: 'bg-blue-100' },
        { id: 'ps3', name: 'Proposta', order: 3, probability: 50, color: 'bg-yellow-100' },
        { id: 'ps4', name: 'Negociação', order: 4, probability: 75, color: 'bg-orange-100' },
        { id: 'ps5', name: 'Fechado/Ganho', order: 5, probability: 100, color: 'bg-green-100' },
    ];
    return {
        users: [{ id: adminId, name: 'Administrador', email: 'admin@crm.pt', password: '123', role: 'admin' }],
        currentUser: null,
        clients: [{
            id: '1', userId: adminId, companyName: 'Tech Solutions Lda', contactName: 'João Silva',
            email: 'joao.silva@tech.pt', phone: '210000000', mobile: '910000000', paymentConditions: '30 dias',
            notes: 'Cliente estratégico na área de tecnologia.', clientNumber1: 'C001',
            createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
            subContacts: [{ id: 'sc1', name: 'Maria Santos', role: 'Financeira', email: 'maria@tech.pt', phone: '912222222' }]
        }],
        leads: [{
            id: 'l1', userId: adminId, companyName: 'Inovação Futura', contactName: 'Carlos Santos',
            email: 'carlos@inovacao.pt', phone: '920000000', source: 'Website', status: 'new',
            score: 75, notes: 'Interessado em consultoria cloud.', createdAt: new Date().toISOString()
        }],
        interactions: [{ id: 'i1', userId: adminId, clientId: '1', type: 'phone', date: new Date().toISOString(), summary: 'Chamada de acompanhamento mensal', nextSteps: 'Enviar proposta renovação' }],
        opportunities: [{ id: 'o1', userId: adminId, clientId: '1', title: 'Renovação Anual', value: 5000, status: 'open', stage: 'ps3', createdAt: new Date().toISOString() }],
        pipelineStages,
        sales: [{ id: 's1', userId: adminId, clientId: '1', date: new Date(Date.now() - 86400000 * 30).toISOString(), value: 1200, productType: 'product', description: 'Licença Software' }],
        tasks: [],
        campaigns: [],
        documents: [],
        settings: {
            classifications: [
                { id: 'c1', label: 'VIP', minSales: 20000, color: 'bg-purple-100 text-purple-700 border-purple-200' },
                { id: 'c2', label: 'Premium', minSales: 12000, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
                { id: 'c3', label: 'Regular', minSales: 5000, color: 'bg-blue-100 text-blue-700 border-blue-200' },
                { id: 'c4', label: 'Pontual', minSales: 1000, color: 'bg-amber-100 text-amber-700 border-amber-200' },
                { id: 'c5', label: 'Indiferente', minSales: 0, color: 'bg-slate-100 text-slate-600 border-slate-200' },
            ],
            taskDefinitions: [
                { id: 'td1', title: 'Ligar ao Cliente', defaultPriority: 'high', daysToComplete: 1 },
                { id: 'td2', title: 'Enviar Email de Follow-up', defaultPriority: 'medium', daysToComplete: 2 },
            ],
            pipelineStages
        }
    };
};

type Action =
    | { type: 'SET_STATE'; payload: CRMState }
    | { type: 'SET_CURRENT_USER'; payload: User | null }
    | { type: 'ADD_USER'; payload: User }
    | { type: 'ADD_CLIENT'; payload: Client }
    | { type: 'UPDATE_CLIENT'; payload: { id: string, updates: Partial<Client> } }
    | { type: 'DELETE_CLIENT'; payload: string }
    | { type: 'ADD_LEAD'; payload: Lead }
    | { type: 'UPDATE_LEAD'; payload: { id: string, updates: Partial<Lead> } }
    | { type: 'ADD_INTERACTION'; payload: Interaction }
    | { type: 'ADD_OPPORTUNITY'; payload: Opportunity }
    | { type: 'UPDATE_OPPORTUNITY'; payload: { id: string, updates: Partial<Opportunity> } }
    | { type: 'UPDATE_OPPORTUNITY_STATUS'; payload: { id: string, status: OpportunityStatus } }
    | { type: 'ADD_SALE'; payload: Sale }
    | { type: 'ADD_TASK'; payload: Task }
    | { type: 'TOGGLE_TASK'; payload: string }
    | { type: 'DELETE_TASK'; payload: string }
    | { type: 'ADD_CAMPAIGN'; payload: Campaign }
    | { type: 'ADD_DOCUMENT'; payload: Document }
    | { type: 'ADD_CLASSIFICATION'; payload: ClassificationLevel }
    | { type: 'UPDATE_CLASSIFICATION'; payload: { id: string, updates: Partial<ClassificationLevel> } }
    | { type: 'REMOVE_CLASSIFICATION'; payload: string }
    | { type: 'ADD_TASK_DEF'; payload: TaskDefinition }
    | { type: 'REMOVE_TASK_DEF'; payload: string }
    | { type: 'UPDATE_PIPELINE_STAGE'; payload: { id: string, updates: Partial<PipelineStage> } }
    | { type: 'IMPORT_CLIENTS'; payload: Client[] }
    | { type: 'IMPORT_FULL_STATE'; payload: Partial<CRMState> };

function crmReducer(state: CRMState, action: Action): CRMState {
    switch (action.type) {
        case 'SET_STATE': return action.payload;
        case 'SET_CURRENT_USER': return { ...state, currentUser: action.payload };
        case 'ADD_USER': return { ...state, users: [...state.users, action.payload] };
        case 'ADD_CLIENT': return { ...state, clients: [...state.clients, action.payload] };
        case 'UPDATE_CLIENT': return { ...state, clients: state.clients.map(c => c.id === action.payload.id ? { ...c, ...action.payload.updates, updatedAt: new Date().toISOString() } : c) };
        case 'DELETE_CLIENT': return { ...state, clients: state.clients.filter(c => c.id !== action.payload) };
        case 'ADD_LEAD': return { ...state, leads: [...state.leads, action.payload] };
        case 'UPDATE_LEAD': return { ...state, leads: state.leads.map(l => l.id === action.payload.id ? { ...l, ...action.payload.updates } : l) };
        case 'ADD_INTERACTION': return { ...state, interactions: [action.payload, ...state.interactions] };
        case 'ADD_OPPORTUNITY': return { ...state, opportunities: [action.payload, ...state.opportunities] };
        case 'UPDATE_OPPORTUNITY': return { ...state, opportunities: state.opportunities.map(o => o.id === action.payload.id ? { ...o, ...action.payload.updates } : o) };
        case 'UPDATE_OPPORTUNITY_STATUS': return { ...state, opportunities: state.opportunities.map(o => o.id === action.payload.id ? { ...o, status: action.payload.status } : o) };
        case 'ADD_SALE': return { ...state, sales: [action.payload, ...state.sales] };
        case 'ADD_TASK': return { ...state, tasks: [action.payload, ...state.tasks] };
        case 'TOGGLE_TASK': return { ...state, tasks: state.tasks.map(t => t.id === action.payload ? { ...t, completed: !t.completed } : t) };
        case 'DELETE_TASK': return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
        case 'ADD_CAMPAIGN': return { ...state, campaigns: [action.payload, ...state.campaigns] };
        case 'ADD_DOCUMENT': return { ...state, documents: [action.payload, ...state.documents] };
        case 'ADD_CLASSIFICATION': return { ...state, settings: { ...state.settings, classifications: [...state.settings.classifications, action.payload] } };
        case 'UPDATE_CLASSIFICATION': return { ...state, settings: { ...state.settings, classifications: state.settings.classifications.map(c => c.id === action.payload.id ? { ...c, ...action.payload.updates } : c) } };
        case 'REMOVE_CLASSIFICATION': return { ...state, settings: { ...state.settings, classifications: state.settings.classifications.filter(c => c.id !== action.payload) } };
        case 'ADD_TASK_DEF': return { ...state, settings: { ...state.settings, taskDefinitions: [...state.settings.taskDefinitions, action.payload] } };
        case 'REMOVE_TASK_DEF': return { ...state, settings: { ...state.settings, taskDefinitions: state.settings.taskDefinitions.filter(td => td.id !== action.payload) } };
        case 'UPDATE_PIPELINE_STAGE': return { ...state, settings: { ...state.settings, pipelineStages: state.settings.pipelineStages.map(ps => ps.id === action.payload.id ? { ...ps, ...action.payload.updates } : ps) } };
        case 'IMPORT_CLIENTS': return { ...state, clients: [...state.clients, ...action.payload] };
        case 'IMPORT_FULL_STATE': return { ...state, ...action.payload, settings: { ...state.settings, ...(action.payload.settings || {}) } };
        default: return state;
    }
}

export const CRMProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(crmReducer, initialMockData());

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                dispatch({ type: 'SET_STATE', payload: JSON.parse(saved) });
            } catch (e) {
                console.error('Failed to parse CRM storage', e);
            }
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const actions: CRMActions = {
        login: (email, pass) => {
            const user = state.users.find(u => u.email === email && u.password === pass);
            if (user) {
                dispatch({ type: 'SET_CURRENT_USER', payload: user });
                return true;
            }
            return false;
        },
        logout: () => dispatch({ type: 'SET_CURRENT_USER', payload: null }),
        register: (name, email, pass) => {
            if (state.users.some(u => u.email === email)) return false;
            const newUser: User = { id: uuidv4(), name, email, password: pass, role: 'user' };
            dispatch({ type: 'ADD_USER', payload: newUser });
            dispatch({ type: 'SET_CURRENT_USER', payload: newUser });
            return true;
        },
        addClient: (data) => {
            if (!state.currentUser) return;
            const newClient: Client = { ...data, id: uuidv4(), userId: state.currentUser.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
            dispatch({ type: 'ADD_CLIENT', payload: newClient });
        },
        updateClient: (id, updates) => dispatch({ type: 'UPDATE_CLIENT', payload: { id, updates } }),
        deleteClient: (id) => dispatch({ type: 'DELETE_CLIENT', payload: id }),
        addLead: (data) => {
            if (!state.currentUser) return;
            const newLead: Lead = { ...data, id: uuidv4(), userId: state.currentUser.id, score: 50, createdAt: new Date().toISOString() };
            dispatch({ type: 'ADD_LEAD', payload: newLead });
        },
        updateLead: (id, updates) => dispatch({ type: 'UPDATE_LEAD', payload: { id, updates } }),
        convertLead: (leadId) => {
            const lead = state.leads.find(l => l.id === leadId);
            if (!lead) return;
            const clientId = uuidv4();
            const newClient: Client = {
                id: clientId, userId: lead.userId, companyName: lead.companyName, contactName: lead.contactName,
                email: lead.email, phone: lead.phone, paymentConditions: '30 dias',
                notes: `Convertido de Lead. Notas originais: ${lead.notes}`, subContacts: [],
                createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
            };
            dispatch({ type: 'ADD_CLIENT', payload: newClient });
            dispatch({ type: 'UPDATE_LEAD', payload: { id: leadId, updates: { status: 'converted', convertedAt: new Date().toISOString(), convertedClientId: clientId } } });
        },
        addInteraction: (data) => {
            if (!state.currentUser) return;
            dispatch({ type: 'ADD_INTERACTION', payload: { ...data, id: uuidv4(), userId: state.currentUser.id } });
        },
        addOpportunity: (data) => {
            if (!state.currentUser) return;
            dispatch({ type: 'ADD_OPPORTUNITY', payload: { ...data, id: uuidv4(), userId: state.currentUser.id, createdAt: new Date().toISOString() } });
        },
        updateOpportunity: (id, updates) => dispatch({ type: 'UPDATE_OPPORTUNITY', payload: { id, updates } }),
        updateOpportunityStatus: (id, status) => dispatch({ type: 'UPDATE_OPPORTUNITY_STATUS', payload: { id, status } }),
        addSale: (data) => {
            if (!state.currentUser) return;
            dispatch({ type: 'ADD_SALE', payload: { ...data, id: uuidv4(), userId: state.currentUser.id } });
        },
        addTask: (data) => {
            if (!state.currentUser) return;
            dispatch({ type: 'ADD_TASK', payload: { ...data, id: uuidv4(), userId: state.currentUser.id, createdAt: new Date().toISOString() } });
        },
        toggleTaskCompletion: (id) => dispatch({ type: 'TOGGLE_TASK', payload: id }),
        deleteTask: (id) => dispatch({ type: 'DELETE_TASK', payload: id }),
        addCampaign: (data) => {
            if (!state.currentUser) return;
            dispatch({ type: 'ADD_CAMPAIGN', payload: { ...data, id: uuidv4(), userId: state.currentUser.id, createdAt: new Date().toISOString(), metrics: { sent: 0, opened: 0, clicked: 0, bounced: 0 } } });
        },
        addDocument: (data) => {
            if (!state.currentUser) return;
            dispatch({ type: 'ADD_DOCUMENT', payload: { ...data, id: uuidv4(), userId: state.currentUser.id, createdAt: new Date().toISOString(), version: 1 } });
        },
        addClassification: (data) => dispatch({ type: 'ADD_CLASSIFICATION', payload: { ...data, id: uuidv4() } }),
        updateClassification: (id, updates) => dispatch({ type: 'UPDATE_CLASSIFICATION', payload: { id, updates } }),
        removeClassification: (id) => dispatch({ type: 'REMOVE_CLASSIFICATION', payload: id }),
        addTaskDefinition: (data) => dispatch({ type: 'ADD_TASK_DEF', payload: { ...data, id: uuidv4() } }),
        removeTaskDefinition: (id) => dispatch({ type: 'REMOVE_TASK_DEF', payload: id }),
        updatePipelineStage: (id, updates) => dispatch({ type: 'UPDATE_PIPELINE_STAGE', payload: { id, updates } }),
        importClients: (newClients) => dispatch({ type: 'IMPORT_CLIENTS', payload: newClients }),
        importFullState: (newState) => dispatch({ type: 'IMPORT_FULL_STATE', payload: newState }),
    };

    return (
        <CRMContext.Provider value={{ ...state, ...actions }}>
            {children}
        </CRMContext.Provider>
    );
};

export const useCRM = () => {
    const context = useContext(CRMContext);
    if (!context) throw new Error('useCRM must be used within a CRMProvider');
    return context;
};
