import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Building2, Phone, Mail, MapPin } from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { calculateClientTotalSales, getClientClassification } from '../utils/clientClassification';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function ClientsList() {
    const navigate = useNavigate();
    const { clients, sales, settings } = useCRM();
    const classifications = settings.classifications;
    const [searchTerm, setSearchTerm] = useState('');

    const filteredClients = clients.filter(client =>
        client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
                    <p className="text-slate-500">Gerir carteira de clientes e contactos</p>
                </div>
                <Button onClick={() => navigate('/clients/new')}>
                    <Plus className="w-4 h-4" />
                    Novo Cliente
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Pesquisar por nome, empresa ou email..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="text-sm text-slate-500">
                    {filteredClients.length} clientes encontrados
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map((client) => (
                    <Card
                        key={client.id}
                        className="hover:shadow-md transition-shadow cursor-pointer group"
                        onClick={() => navigate(`/clients/${client.id}`)}
                    >
                        <div className="flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className="w-12 h-12 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                                    {client.clientNumber1 || 'N/A'}
                                </span>
                                {(() => {
                                    const total = calculateClientTotalSales(client.id, sales);
                                    const classification = getClientClassification(total, classifications);
                                    return (
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full border ${classification.color}`}>
                                            {classification.label}
                                        </span>
                                    );
                                })()}
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-900 text-lg group-hover:text-primary-600 transition-colors">
                                    {client.companyName}
                                </h3>
                                <p className="text-slate-500 text-sm">{client.contactName}</p>
                            </div>

                            <div className="space-y-2 pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    {client.phone}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <span className="truncate">{client.email}</span>
                                </div>
                                {client.address && (
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        <span className="truncate">{client.address}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredClients.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">Nenhum cliente encontrado</h3>
                    <p className="text-slate-500">Tente ajustar a sua pesquisa.</p>
                </div>
            )}
        </div>
    );
}
