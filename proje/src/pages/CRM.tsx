import { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Phone, Mail, Users, Calendar, Plus, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import type { ContactType } from '../types';

export default function CRM() {
    const { clients, interactions, addInteraction } = useCRM();
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Form state
    const [clientId, setClientId] = useState('');
    const [type, setType] = useState<ContactType>('phone');
    const [summary, setSummary] = useState('');
    const [nextSteps, setNextSteps] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientId) return;

        addInteraction({
            clientId,
            type,
            date: new Date().toISOString(),
            summary,
            nextSteps
        });

        setIsFormOpen(false);
        setSummary('');
        setNextSteps('');
    };

    const getIcon = (type: ContactType) => {
        switch (type) {
            case 'phone': return <Phone className="w-5 h-5 text-blue-500" />;
            case 'email': return <Mail className="w-5 h-5 text-purple-500" />;
            case 'meeting': return <Users className="w-5 h-5 text-orange-500" />;
        }
    };

    const getTypeLabel = (type: ContactType) => {
        switch (type) {
            case 'phone': return 'Telefone';
            case 'email': return 'Email';
            case 'meeting': return 'Reunião';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">CRM & Interações</h1>
                    <p className="text-slate-500">Histórico de contactos e atividades comerciais</p>
                </div>
                <Button onClick={() => setIsFormOpen(!isFormOpen)}>
                    <Plus className="w-4 h-4" />
                    Nova Interação
                </Button>
            </div>

            {isFormOpen && (
                <Card className="bg-slate-50 border-primary-100">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
                                <select required className="input-field" value={clientId} onChange={e => setClientId(e.target.value)}>
                                    <option value="">Selecione um cliente...</option>
                                    {clients.map(c => (
                                        <option key={c.id} value={c.id}>{c.companyName}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Contacto</label>
                                <select className="input-field" value={type} onChange={e => setType(e.target.value as ContactType)}>
                                    <option value="phone">Telefone</option>
                                    <option value="email">Email</option>
                                    <option value="meeting">Reunião Presencial/Online</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Resumo da Conversa</label>
                                <textarea required className="input-field h-24" value={summary} onChange={e => setSummary(e.target.value)} placeholder="O que foi discutido?" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Próximos Passos</label>
                                <input className="input-field" value={nextSteps} onChange={e => setNextSteps(e.target.value)} placeholder="Ação futura necessária..." />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
                            <Button type="submit">Registar</Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="space-y-4">
                {interactions.map(interaction => {
                    const client = clients.find(c => c.id === interaction.clientId);
                    return (
                        <Card key={interaction.id} className="hover:shadow-md transition-shadow">
                            <div className="flex gap-4">
                                <div className="mt-1 p-2 bg-slate-50 rounded-lg h-fit">
                                    {getIcon(interaction.type)}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{client?.companyName || 'Cliente Removido'}</h3>
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <span>{getTypeLabel(interaction.type)}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(new Date(interaction.date), "d 'de' MMMM 'às' HH:mm", { locale: pt })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 bg-slate-50 p-3 rounded-lg text-sm">
                                        {interaction.summary}
                                    </p>
                                    {interaction.nextSteps && (
                                        <div className="flex items-center gap-2 text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1.5 rounded w-fit">
                                            <MessageSquare className="w-3 h-3" />
                                            Próximos Passos: {interaction.nextSteps}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    );
                })}
                {interactions.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        Nenhuma interação registada ainda.
                    </div>
                )}
            </div>
        </div>
    );
}
