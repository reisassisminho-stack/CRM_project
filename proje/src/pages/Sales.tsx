import { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TrendingUp, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

export default function Sales() {
    const { clients, opportunities, sales, addOpportunity } = useCRM();
    const [activeTab, setActiveTab] = useState<'opportunities' | 'sales'>('opportunities');

    // New Opportunity Form State (simplified)
    const [isOppFormOpen, setIsOppFormOpen] = useState(false);
    const [oppForm, setOppForm] = useState({ clientId: '', title: '', value: 0 });

    const handleOppSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addOpportunity({
            ...oppForm,
            status: 'open',
            stage: 'ps1' // Default stage
        });
        setIsOppFormOpen(false);
        setOppForm({ clientId: '', title: '', value: 0 });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Vendas & Oportunidades</h1>
                    <p className="text-slate-500">Gestão de pipeline e histórico de faturação</p>
                </div>
            </div>

            <div className="flex gap-4 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('opportunities')}
                    className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'opportunities' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Oportunidades em Aberto
                </button>
                <button
                    onClick={() => setActiveTab('sales')}
                    className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'sales' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Histórico de Vendas
                </button>
            </div>

            {activeTab === 'opportunities' && (
                <div className="space-y-6">
                    <Button onClick={() => setIsOppFormOpen(!isOppFormOpen)}>
                        <TrendingUp className="w-4 h-4" /> Nova Oportunidade
                    </Button>

                    {isOppFormOpen && (
                        <Card className="bg-slate-50">
                            <form onSubmit={handleOppSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div className="md:col-span-1">
                                    <label className="text-sm font-medium text-slate-700">Cliente</label>
                                    <select required className="input-field" value={oppForm.clientId} onChange={e => setOppForm({ ...oppForm, clientId: e.target.value })}>
                                        <option value="">Selecione...</option>
                                        {clients.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Título</label>
                                    <input required className="input-field" value={oppForm.title} onChange={e => setOppForm({ ...oppForm, title: e.target.value })} placeholder="Ex: Renovação Contrato" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Valor (€)</label>
                                    <input required type="number" className="input-field" value={oppForm.value} onChange={e => setOppForm({ ...oppForm, value: Number(e.target.value) })} />
                                </div>
                                <div className="md:col-span-4 flex justify-end gap-2">
                                    <Button type="button" variant="ghost" onClick={() => setIsOppFormOpen(false)}>Cancelar</Button>
                                    <Button type="submit">Criar</Button>
                                </div>
                            </form>
                        </Card>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                        {opportunities.map(opp => {
                            const client = clients.find(c => c.id === opp.clientId);
                            return (
                                <Card key={opp.id} className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-full ${opp.status === 'open' ? 'bg-blue-100 text-blue-600' : opp.status === 'won' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {opp.status === 'open' ? <TrendingUp className="w-5 h-5" /> : opp.status === 'won' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{opp.title}</h3>
                                            <p className="text-sm text-slate-500">{client?.companyName}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900 text-lg">{opp.value.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</p>
                                        <p className="text-xs text-slate-400">{format(new Date(opp.createdAt), "d MMM yyyy", { locale: pt })}</p>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}

            {activeTab === 'sales' && (
                <div className="space-y-4">
                    {sales.map(sale => {
                        const client = clients.find(c => c.id === sale.clientId);
                        return (
                            <Card key={sale.id} className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-green-50 text-green-600">
                                        <DollarSign className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{sale.description}</h3>
                                        <p className="text-sm text-slate-500">{client?.companyName} • {sale.productType === 'product' ? 'Produto' : sale.productType === 'service' ? 'Serviço' : 'Consultoria'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900 text-lg">{sale.value.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</p>
                                    <p className="text-xs text-slate-400">{format(new Date(sale.date), "d MMM yyyy", { locale: pt })}</p>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
