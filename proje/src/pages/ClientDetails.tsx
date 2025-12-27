import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Phone, Mail, UserPlus, FileText } from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { calculateClientTotalSales, getClientClassification } from '../utils/clientClassification';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function ClientDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { clients, sales, settings } = useCRM();
    const client = clients.find(c => c.id === id);
    const classifications = settings.classifications;

    if (!client) {
        return <div>Cliente não encontrado</div>;
    }

    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={() => navigate('/clients')} className="pl-0 gap-1">
                <ArrowLeft className="w-4 h-4" /> Voltar
            </Button>

            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center text-2xl font-bold">
                            {client.companyName.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold text-slate-900">{client.companyName}</h1>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {client.phone}</span>
                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {client.email}</span>
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">ID: {client.clientNumber1}</span>
                                {(() => {
                                    const total = calculateClientTotalSales(client.id, sales);
                                    const classification = getClientClassification(total, classifications);
                                    return (
                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${classification.color}`}>
                                            {classification.label}
                                        </span>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <FileText className="w-4 h-4" /> Relatório
                        </Button>
                        <Button onClick={() => navigate(`/clients/${id}/edit`)}>
                            <Edit2 className="w-4 h-4" /> Editar
                        </Button>
                    </div>
                </div>

                {/* Tabs Placeholder */}
                <div className="flex items-center gap-6 mt-8 border-b border-slate-100">
                    <button className="pb-3 border-b-2 border-primary-600 text-primary-600 font-medium text-sm">Visão Geral</button>
                    <button className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 font-medium text-sm transition-colors">Contactos</button>
                    <button className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 font-medium text-sm transition-colors">CRM & Histórico</button>
                    <button className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 font-medium text-sm transition-colors">Vendas</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Observações">
                        <p className="text-slate-600 whitespace-pre-wrap">{client.notes || 'Sem observações.'}</p>
                    </Card>

                    <Card title="Sub-Contactos" action={<Button variant="ghost" size="sm"><UserPlus className="w-4 h-4" /></Button>}>
                        <div className="space-y-4">
                            {client.subContacts.map(contact => (
                                <div key={contact.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center font-medium text-slate-600">
                                            {contact.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{contact.name}</p>
                                            <p className="text-sm text-slate-500">{contact.role}</p>
                                        </div>
                                    </div>
                                    <div className="text-right text-sm">
                                        <p className="text-slate-900">{contact.phone}</p>
                                        <p className="text-slate-500">{contact.email}</p>
                                    </div>
                                </div>
                            ))}
                            {client.subContacts.length === 0 && <p className="text-slate-500 italic">Sem contactos adicionais.</p>}
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card title="Detalhes Comerciais">
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase">Condições Pagamento</label>
                                <p className="font-medium text-slate-900">{client.paymentConditions}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase">Nº Cliente Alt.</label>
                                <p className="font-medium text-slate-900">{client.clientNumber2 || '-'}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase">Registado em</label>
                                <p className="font-medium text-slate-900">{new Date(client.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
