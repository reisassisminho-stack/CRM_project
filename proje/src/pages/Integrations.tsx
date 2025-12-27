import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Plus, BarChart3, TrendingUp, Bell, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Integrations() {
    const { addClient } = useCRM();
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target?.result as string;
                // Simple CSV Parser assuming "Name,Email,Phone,Company" format
                // In a real app, use a library like PapaParse
                const lines = text.split('\n');
                let count = 0;

                lines.forEach((line, index) => {
                    if (index === 0) return; // Skip header
                    const cols = line.split(',');
                    if (cols.length >= 2) {
                        const name = cols[0]?.trim();
                        const email = cols[1]?.trim();
                        const phone = cols[2]?.trim();
                        const company = cols[3]?.trim();

                        if (name && company) {
                            addClient({
                                companyName: company,
                                contactName: name,
                                email: email || '',
                                phone: phone || '',
                                paymentConditions: '30 dias',
                                notes: 'Importado via CSV',
                                subContacts: []
                            });
                            count++;
                        }
                    }
                });

                setFeedback({ type: 'success', message: `${count} clientes importados com sucesso!` });
            } catch (err) {
                setFeedback({ type: 'error', message: 'Erro ao processar ficheiro. Verifique o formato.' });
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Integrações</h1>
                <p className="text-slate-500">Importe dados de outras fontes</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* CSV Import Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Importar CSV</h3>
                            <p className="text-sm text-slate-500">Importe clientes de um ficheiro CSV</p>
                        </div>
                    </div>

                    <p className="text-sm text-slate-600 mb-6">
                        O ficheiro deve ter o formato: <br />
                        <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">Nome,Email,Telefone,Empresa</code>
                    </p>

                    <div className="relative">
                        <input
                            type="file"
                            accept=".csv"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleFileUpload}
                        />
                        <Button className="w-full justify-center pointer-events-none">
                            <Plus size={18} className="mr-2" />
                            Selecionar Ficheiro CSV
                        </Button>
                    </div>
                </div>

                {/* JSON Import Card (Placeholder) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 opacity-60">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                            <BarChart3 size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Importar JSON</h3>
                            <p className="text-sm text-slate-500">Brevemente</p>
                        </div>
                    </div>
                    <Button disabled className="w-full justify-center">
                        Brevemente...
                    </Button>
                </div>
            </div>

            {feedback && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {feedback.type === 'success' ? <Check size={20} /> : <Bell size={20} />}
                    {feedback.message}
                </div>
            )}
        </div>
    );
}
