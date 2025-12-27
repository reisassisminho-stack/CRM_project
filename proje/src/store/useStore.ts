import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type {
    Client, Interaction, Opportunity, Sale, OpportunityStatus,
    ClassificationLevel, User, Task, TaskDefinition,
    Lead, PipelineStage, Campaign, Document, LeadStatus
} from '../types';

interface AppState {
    // Auth & Users
    users: User[];
    currentUser: User | null;

    // Data
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

    // Auth Actions
    login: (email: string, pass: string) => boolean;
    logout: () => void;
    register: (name: string, email: string, pass: string) => boolean;

    // Data Actions
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

    // Task Actions
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'userId'>) => void;
    toggleTaskCompletion: (id: string) => void;
    deleteTask: (id: string) => void;

    // Marketing & Documents
    addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'userId' | 'metrics'>) => void;
    addDocument: (doc: Omit<Document, 'id' | 'createdAt' | 'userId' | 'version'>) => void;

    // Settings Actions
    addClassification: (classification: Omit<ClassificationLevel, 'id'>) => void;
    updateClassification: (id: string, updates: Partial<ClassificationLevel>) => void;
    removeClassification: (id: string) => void;

    addTaskDefinition: (def: Omit<TaskDefinition, 'id'>) => void;
    removeTaskDefinition: (id: string) => void;

    updatePipelineStage: (id: string, updates: Partial<PipelineStage>) => void;

    // Import/Export Actions
    importClients: (clients: Client[]) => void;
    importFullState: (state: Partial<AppState>) => void;
}

const generateMockData = () => {
    const adminId = 'admin-user-id';

    const users: User[] = [
        { id: adminId, name: 'Administrador', email: 'admin@crm.pt', password: '123', role: 'admin' }
    ];

    const pipelineStages: PipelineStage[] = [
        { id: 'ps1', name: 'Prospeção', order: 1, probability: 10, color: 'bg-slate-100' },
        { id: 'ps2', name: 'Qualificação', order: 2, probability: 25, color: 'bg-blue-100' },
        { id: 'ps3', name: 'Proposta', order: 3, probability: 50, color: 'bg-yellow-100' },
        { id: 'ps4', name: 'Negociação', order: 4, probability: 75, color: 'bg-orange-100' },
        { id: 'ps5', name: 'Fechado/Ganho', order: 5, probability: 100, color: 'bg-green-100' },
    ];

    const clients: Client[] = [
        {
            id: '1',
            userId: adminId,
            companyName: 'Tech Solutions Lda',
            contactName: 'João Silva',
            email: 'joao.silva@tech.pt',
            phone: '210000000',
            mobile: '910000000',
            paymentConditions: '30 dias',
            notes: 'Cliente estratégico na área de tecnologia.',
            clientNumber1: 'C001',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            subContacts: [
                { id: 'sc1', name: 'Maria Santos', role: 'Financeira', email: 'maria@tech.pt', phone: '912222222' }
            ]
        }
    ];

    const leads: Lead[] = [
        {
            id: 'l1',
            userId: adminId,
            companyName: 'Inovação Futura',
            contactName: 'Carlos Santos',
            email: 'carlos@inovacao.pt',
            phone: '920000000',
            source: 'Website',
            status: 'new',
            score: 75,
            notes: 'Interessado em consultoria cloud.',
            createdAt: new Date().toISOString()
        }
    ];

    const interactions: Interaction[] = [
        { id: 'i1', userId: adminId, clientId: '1', type: 'phone', date: new Date().toISOString(), summary: 'Chamada de acompanhamento mensal', nextSteps: 'Enviar proposta renovação' }
    ];

    const opportunities: Opportunity[] = [
        { id: 'o1', userId: adminId, clientId: '1', title: 'Renovação Anual', value: 5000, status: 'open', stage: 'ps3', createdAt: new Date().toISOString() }
    ];

    const sales: Sale[] = [
        { id: 's1', userId: adminId, clientId: '1', date: new Date(Date.now() - 86400000 * 30).toISOString(), value: 1200, productType: 'product', description: 'Licença Software' }
    ];

    const classifications: ClassificationLevel[] = [
        { id: 'c1', label: 'VIP', minSales: 20000, color: 'bg-purple-100 text-purple-700 border-purple-200' },
        { id: 'c2', label: 'Premium', minSales: 12000, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
        { id: 'c3', label: 'Regular', minSales: 5000, color: 'bg-blue-100 text-blue-700 border-blue-200' },
        { id: 'c4', label: 'Pontual', minSales: 1000, color: 'bg-amber-100 text-amber-700 border-amber-200' },
        { id: 'c5', label: 'Indiferente', minSales: 0, color: 'bg-slate-100 text-slate-600 border-slate-200' },
    ];

    const taskDefinitions: TaskDefinition[] = [
        { id: 'td1', title: 'Ligar ao Cliente', defaultPriority: 'high', daysToComplete: 1 },
        { id: 'td2', title: 'Enviar Email de Follow-up', defaultPriority: 'medium', daysToComplete: 2 },
    ];

    return {
        users, currentUser: null, clients, leads, interactions, opportunities,
        pipelineStages, sales, tasks: [], campaigns: [], documents: [],
        settings: { classifications, taskDefinitions, pipelineStages }
    };
};

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            ...generateMockData(),

            login: (email, pass) => {
                const user = get().users.find(u => u.email === email && u.password === pass);
                if (user) {
                    set({ currentUser: user });
                    return true;
                }
                return false;
            },
            logout: () => set({ currentUser: null }),
            register: (name, email, pass) => {
                const exists = get().users.some(u => u.email === email);
                if (exists) return false;
                const newUser: User = { id: uuidv4(), name, email, password: pass, role: 'user' };
                set(state => ({ users: [...state.users, newUser], currentUser: newUser }));
                return true;
            },

            addClient: (clientData) => {
                const currentUser = get().currentUser;
                if (!currentUser) return;
                set((state) => ({
                    clients: [...state.clients, {
                        ...clientData,
                        id: uuidv4(),
                        userId: currentUser.id,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }]
                }));
            },

            updateClient: (id, updates) => set((state) => ({
                clients: state.clients.map((c) => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c)
            })),

            deleteClient: (id) => set((state) => ({
                clients: state.clients.filter((c) => c.id !== id)
            })),

            addLead: (leadData) => {
                const currentUser = get().currentUser;
                if (!currentUser) return;
                set((state) => ({
                    leads: [...state.leads, {
                        ...leadData,
                        id: uuidv4(),
                        userId: currentUser.id,
                        score: 50, // Default score
                        createdAt: new Date().toISOString()
                    }]
                }));
            },

            updateLead: (id, updates) => set((state) => ({
                leads: state.leads.map((l) => l.id === id ? { ...l, ...updates } : l)
            })),

            convertLead: (leadId) => {
                const state = get();
                const lead = state.leads.find(l => l.id === leadId);
                if (!lead) return;

                const clientId = uuidv4();
                const newClient: Client = {
                    id: clientId,
                    userId: lead.userId,
                    companyName: lead.companyName,
                    contactName: lead.contactName,
                    email: lead.email,
                    phone: lead.phone,
                    paymentConditions: '30 dias',
                    notes: `Convertido de Lead. Notas originais: ${lead.notes}`,
                    subContacts: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                set(state => ({
                    clients: [...state.clients, newClient],
                    leads: state.leads.map(l => l.id === leadId ? { ...l, status: 'converted', convertedAt: new Date().toISOString(), convertedClientId: clientId } : l)
                }));
            },

            addInteraction: (data) => {
                const currentUser = get().currentUser;
                if (!currentUser) return;
                set((state) => ({
                    interactions: [{ ...data, id: uuidv4(), userId: currentUser.id }, ...state.interactions]
                }));
            },

            addOpportunity: (data) => {
                const currentUser = get().currentUser;
                if (!currentUser) return;
                set((state) => ({
                    opportunities: [{ ...data, id: uuidv4(), userId: currentUser.id, createdAt: new Date().toISOString() }, ...state.opportunities]
                }));
            },

            updateOpportunity: (id, updates) => set((state) => ({
                opportunities: state.opportunities.map((o) => o.id === id ? { ...o, ...updates } : o)
            })),

            updateOpportunityStatus: (id, status) => set((state) => ({
                opportunities: state.opportunities.map((o) => o.id === id ? { ...o, status } : o)
            })),

            addSale: (data) => {
                const currentUser = get().currentUser;
                if (!currentUser) return;
                set((state) => ({
                    sales: [{ ...data, id: uuidv4(), userId: currentUser.id }, ...state.sales]
                }));
            },

            addTask: (data) => {
                const currentUser = get().currentUser;
                if (!currentUser) return;
                set((state) => ({
                    tasks: [{ ...data, id: uuidv4(), userId: currentUser.id, createdAt: new Date().toISOString() }, ...state.tasks]
                }));
            },

            toggleTaskCompletion: (id) => set(state => ({
                tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
            })),

            deleteTask: (id) => set(state => ({
                tasks: state.tasks.filter(t => t.id !== id)
            })),

            addCampaign: (data) => {
                const currentUser = get().currentUser;
                if (!currentUser) return;
                set((state) => ({
                    campaigns: [{ ...data, id: uuidv4(), userId: currentUser.id, createdAt: new Date().toISOString(), metrics: { sent: 0, opened: 0, clicked: 0, bounced: 0 } }, ...state.campaigns]
                }));
            },

            addDocument: (data) => {
                const currentUser = get().currentUser;
                if (!currentUser) return;
                set((state) => ({
                    documents: [{ ...data, id: uuidv4(), userId: currentUser.id, createdAt: new Date().toISOString(), version: 1 }, ...state.documents]
                }));
            },

            addClassification: (data) => set((state) => ({
                settings: {
                    ...state.settings,
                    classifications: [...state.settings.classifications, { ...data, id: uuidv4() }]
                }
            })),

            updateClassification: (id, updates) => set((state) => ({
                settings: {
                    ...state.settings,
                    classifications: state.settings.classifications.map((c) =>
                        c.id === id ? { ...c, ...updates } : c
                    )
                }
            })),

            removeClassification: (id) => set((state) => ({
                settings: {
                    ...state.settings,
                    classifications: state.settings.classifications.filter((c) => c.id !== id)
                }
            })),

            addTaskDefinition: (data) => set((state) => ({
                settings: {
                    ...state.settings,
                    taskDefinitions: [...state.settings.taskDefinitions, { ...data, id: uuidv4() }]
                }
            })),

            removeTaskDefinition: (id) => set((state) => ({
                settings: {
                    ...state.settings,
                    taskDefinitions: state.settings.taskDefinitions.filter(td => td.id !== id)
                }
            })),

            updatePipelineStage: (id, updates) => set((state) => ({
                settings: {
                    ...state.settings,
                    pipelineStages: state.settings.pipelineStages.map(ps => ps.id === id ? { ...ps, ...updates } : ps)
                }
            })),

            importClients: (newClients) => set((state) => ({
                clients: [...state.clients, ...newClients]
            })),

            importFullState: (newState) => set((state) => ({
                ...state,
                ...newState,
                users: newState.users || state.users,
                currentUser: newState.currentUser || state.currentUser,
                settings: {
                    ...state.settings,
                    ...(newState.settings || {})
                }
            })),
        }),
        {
            name: 'crm-storage-v3',
            merge: (persistedState: any, currentState) => {
                return {
                    ...currentState,
                    ...persistedState,
                    settings: {
                        ...currentState.settings,
                        ...(persistedState.settings || {}),
                        taskDefinitions: persistedState.settings?.taskDefinitions || currentState.settings.taskDefinitions,
                        pipelineStages: persistedState.settings?.pipelineStages || currentState.settings.pipelineStages
                    }
                };
            }
        }
    )
);
