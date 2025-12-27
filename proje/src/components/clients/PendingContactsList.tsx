
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Filter } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { calculateClientTotalSales, getClientClassification } from '../../utils/clientClassification';

interface PendingContactsListProps {
    compact?: boolean;
}

export function PendingContactsList({ compact = false }: PendingContactsListProps) {
    const navigate = useNavigate();
    const clients = useStore((state) => state.clients);
    const interactions = useStore((state) => state.interactions);
    const sales = useStore((state) => state.sales);
    const classifications = useStore((state) => state.settings.classifications);

    const [filter, setFilter] = useState<string>('Todos');

    const getLastPhoneContact = (clientId: string) => {
        const clientInteractions = interactions.filter(
            (i) => i.clientId === clientId && i.type === 'phone'
        );

        if (clientInteractions.length === 0) return null;

        // Sort desc to get the latest
        return clientInteractions.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];
    };

    const processedClients = clients.map((client) => {
        const totalSales = calculateClientTotalSales(client.id, sales);
        const classification = getClientClassification(totalSales, classifications);
        const lastContact = getLastPhoneContact(client.id);

        return {
            ...client,
            classification,
            lastContact,
            lastContactDate: lastContact ? new Date(lastContact.date) : null
        };
    }).filter((client) => {
        if (filter === 'Todos') return true;
        return client.classification.label === filter;
    }).sort((a, b) => {
        // Sort by last contact date ascending (oldest first)
        // Clients with NO contact come first (highest priority)
        if (!a.lastContactDate && !b.lastContactDate) return 0;
        if (!a.lastContactDate) return -1;
        if (!b.lastContactDate) return 1;
        return a.lastContactDate.getTime() - b.lastContactDate.getTime();
    });

    return (
        <div className={`flex flex-col h-full bg-white rounded-lg ${!compact ? 'border border-slate-100 shadow-sm' : ''}`}>
            <div className="p-4 border-b border-slate-100 space-y-3">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-primary-600" />
                    Contactos Pendentes
                </h3>

                {/* Filter */}
                <div className="relative">
                    <Filter className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <select
                        className="w-full pl-8 pr-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="Todos">Todos os Clientes</option>
                        {classifications.map(c => (
                            <option key={c.id} value={c.label}>{c.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-[500px]">
                {processedClients.map((client) => (
                    <div
                        key={client.id}
                        onClick={() => navigate(`/clients/${client.id}`)}
                        className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all cursor-pointer group"
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${client.classification.color}`}>
                                {client.classification.label}
                            </span>
                            {client.lastContactDate && (
                                <span className="text-[10px] text-slate-400">
                                    {client.lastContactDate.toLocaleDateString('pt-PT')}
                                </span>
                            )}
                        </div>

                        <h4 className="font-medium text-slate-900 text-sm truncate group-hover:text-primary-600">
                            {client.companyName}
                        </h4>

                        <div className="mt-1 space-y-0.5">
                            <p className="text-xs text-slate-500 truncate">
                                {client.contactName}
                            </p>
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {client.phone}
                            </p>
                        </div>
                    </div>
                ))}

                {processedClients.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-400">
                        Nenhum cliente encontrado.
                    </div>
                )}
            </div>
        </div>
    );
}
