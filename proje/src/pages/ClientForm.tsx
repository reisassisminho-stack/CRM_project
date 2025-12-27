import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Phone, Check, Trash2, Plus, X } from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import type { Client, SubContact } from '../types';
import { v4 as uuidv4 } from 'uuid';

export default function ClientForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { clients, addClient, updateClient, deleteClient } = useCRM();

    // Initial state
    const emptyClient: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'userId'> = {
        companyName: '',
        contactName: '',
        nif: '',
        phone: '',
        mobile: '',
        email: '',
        address: '',
        clientNumber1: '',
        clientNumber2: '',
        paymentConditions: '',
        notes: '',
        subContacts: []
    };

    const [form, setForm] = useState(emptyClient);

    useEffect(() => {
        if (id && id !== 'new') {
            const existingClient = clients.find(c => c.id === id);
            if (existingClient) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id: _, createdAt: __, updatedAt: ___, ...rest } = existingClient;
                setForm(rest);
            }
        }
    }, [id, clients]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (id === 'new') {
            addClient(form);
        } else if (id) {
            updateClient(id, form);
        }
        navigate('/clients');
    };

    const handleDelete = () => {
        if (id && id !== 'new' && confirm('Tem a certeza que deseja eliminar este cliente?')) {
            deleteClient(id);
            navigate('/clients');
        }
    };

    const addSubContact = () => {
        const newContact: SubContact = {
            id: uuidv4(),
            name: '',
            role: '',
            phone: '',
            email: ''
        };
        setForm({ ...form, subContacts: [...form.subContacts, newContact] });
    };

    const updateSubContact = (index: number, field: keyof SubContact, value: string) => {
        const updated = [...form.subContacts];
        updated[index] = { ...updated[index], [field]: value };
        setForm({ ...form, subContacts: updated });
    };

    const removeSubContact = (index: number) => {
        const updated = form.subContacts.filter((_, i) => i !== index);
        setForm({ ...form, subContacts: updated });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <Button variant="ghost" type="button" onClick={() => navigate(-1)} className="pl-0 gap-1">
                    <Phone className="w-4 h-4" /> Voltar
                </Button>
                <div className="flex gap-2">
                    {id !== 'new' && (
                        <Button variant="danger" type="button" onClick={handleDelete}>
                            <Trash2 className="w-4 h-4" /> Eliminar
                        </Button>
                    )}
                    <Button type="submit">
                        <Check className="w-4 h-4" /> Guardar
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                <Card title="Dados da Empresa">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Empresa *</label>
                            <input required className="input-field" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Contacto Principal *</label>
                            <input required className="input-field" value={form.contactName} onChange={e => setForm({ ...form, contactName: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">NIF</label>
                            <input className="input-field" value={form.nif} onChange={e => setForm({ ...form, nif: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Telefone *</label>
                            <input required className="input-field" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                            <input required type="email" className="input-field" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Condições de Pagamento</label>
                            <input className="input-field" value={form.paymentConditions} onChange={e => setForm({ ...form, paymentConditions: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Morada</label>
                            <input className="input-field" value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nº Cliente 1</label>
                            <input className="input-field" value={form.clientNumber1 || ''} onChange={e => setForm({ ...form, clientNumber1: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nº Cliente 2</label>
                            <input className="input-field" value={form.clientNumber2 || ''} onChange={e => setForm({ ...form, clientNumber2: e.target.value })} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
                            <textarea className="input-field h-24" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                        </div>
                    </div>
                </Card>

                <Card title="Sub-Contactos (Empresa)" action={<Button type="button" size="sm" variant="outline" onClick={addSubContact}><Plus className="w-4 h-4" /> Adicionar</Button>}>
                    <div className="space-y-4">
                        {form.subContacts.map((contact, index) => (
                            <div key={contact.id} className="p-4 bg-slate-50 rounded-lg relative group">
                                <button type="button" onClick={() => removeSubContact(index)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <input placeholder="Nome" className="input-field text-sm" value={contact.name} onChange={e => updateSubContact(index, 'name', e.target.value)} />
                                    </div>
                                    <div>
                                        <input placeholder="Cargo" className="input-field text-sm" value={contact.role} onChange={e => updateSubContact(index, 'role', e.target.value)} />
                                    </div>
                                    <div>
                                        <input placeholder="Telefone" className="input-field text-sm" value={contact.phone} onChange={e => updateSubContact(index, 'phone', e.target.value)} />
                                    </div>
                                    <div>
                                        <input placeholder="Email" className="input-field text-sm" value={contact.email} onChange={e => updateSubContact(index, 'email', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {form.subContacts.length === 0 && <p className="text-slate-500 italic text-sm text-center py-2">Sem contactos adicionais.</p>}
                    </div>
                </Card>
            </div>
        </form>
    );
}
