import { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Users, Plus, Search, Filter, Mail, Phone, MoreVertical, Star } from 'lucide-react';

export default function Leads() {
    const { leads, addLead, convertLead } = useCRM();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newLead, setNewLead] = useState({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        source: 'Website',
        notes: ''
    });

    const handleAddLead = (e: React.FormEvent) => {
        e.preventDefault();
        addLead({
            ...newLead,
            status: 'new'
        });
        setIsAddModalOpen(false);
        setNewLead({ companyName: '', contactName: '', email: '', phone: '', source: 'Website', notes: '' });
    };

    const filteredLeads = leads.filter(l =>
        l.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.contactName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'contacted': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'qualified': return 'bg-green-100 text-green-700 border-green-200';
            case 'converted': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Gestão de Leads</h1>
                    <p className="text-slate-500">Capture e qualifique potenciais clientes</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="w-4 h-4" />
                    Novo Lead
                </Button>
            </div>

            {isAddModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900">Adicionar Novo Lead</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleAddLead} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Empresa</label>
                                    <input required className="input-field" value={newLead.companyName} onChange={e => setNewLead({ ...newLead, companyName: e.target.value })} placeholder="Nome da empresa" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Contacto</label>
                                    <input required className="input-field" value={newLead.contactName} onChange={e => setNewLead({ ...newLead, contactName: e.target.value })} placeholder="João Silva" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Origem</label>
                                    <select className="input-field" value={newLead.source} onChange={e => setNewLead({ ...newLead, source: e.target.value })}>
                                        <option value="Website">Website</option>
                                        <option value="Referral">Referral</option>
                                        <option value="Evento">Evento</option>
                                        <option value="Social Media">Social Media</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input type="email" required className="input-field" value={newLead.email} onChange={e => setNewLead({ ...newLead, email: e.target.value })} placeholder="email@exemplo.pt" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                                    <input required className="input-field" value={newLead.phone} onChange={e => setNewLead({ ...newLead, phone: e.target.value })} placeholder="910000000" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Notas</label>
                                    <textarea className="input-field h-24" value={newLead.notes} onChange={e => setNewLead({ ...newLead, notes: e.target.value })} placeholder="Detalhes adicionais..." />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                                <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
                                <Button type="submit">Criar Lead</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Pesquisar leads..."
                            className="input-field pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" className="text-slate-600">
                            <Filter className="w-4 h-4 mr-2" />
                            Filtros
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="grid gap-4">
                {filteredLeads.map(lead => (
                    <Card key={lead.id} className="hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-lg">
                                    {lead.companyName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">{lead.companyName}</h3>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {lead.contactName}</span>
                                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email}</span>
                                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.phone}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                <div className="flex flex-col items-end gap-1">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>
                                        {lead.status.toUpperCase()}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                                        <Star className="w-3 h-3 fill-current" />
                                        Score: {lead.score}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {lead.status !== 'converted' && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                                            onClick={() => convertLead(lead.id)}
                                        >
                                            Converter
                                        </Button>
                                    )}
                                    <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
                {filteredLeads.length === 0 && (
                    <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
                        Nenhum lead encontrado.
                    </div>
                )}
            </div>
        </div>
    );
}
