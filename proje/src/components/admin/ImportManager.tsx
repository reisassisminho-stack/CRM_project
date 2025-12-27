import React, { useState, useRef } from 'react';
import { Plus, BarChart3, Check, Bell, TrendingUp } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { parseCSV, mapDataToClients } from '../../utils/dataImport';
import type { ImportMapping } from '../../utils/dataImport';
import type { Client } from '../../types';

export default function ImportManager() {
    const { currentUser, importClients, clients } = useStore();
    const [step, setStep] = useState<'upload' | 'mapping' | 'preview'>('upload');
    const [rawData, setRawData] = useState<string[][]>([]);
    const [mappings, setMappings] = useState<ImportMapping[]>([]);
    const [previewClients, setPreviewClients] = useState<Client[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const clientFields: { label: string; value: keyof Client | 'ignore' | 'subContact' }[] = [
        { label: 'Ignorar', value: 'ignore' },
        { label: 'Empresa', value: 'companyName' },
        { label: 'Contacto Principal', value: 'contactName' },
        { label: 'Email', value: 'email' },
        { label: 'Telefone', value: 'phone' },
        { label: 'Telemóvel', value: 'mobile' },
        { label: 'NIF', value: 'nif' },
        { label: 'Morada', value: 'address' },
        { label: 'Condições Pagamento', value: 'paymentConditions' },
        { label: 'Notas', value: 'notes' },
        { label: 'Nº Cliente 1', value: 'clientNumber1' },
        { label: 'Nº Cliente 2', value: 'clientNumber2' },
        { label: 'Contacto Secundário', value: 'subContact' },
    ];

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            if (file.name.endsWith('.json')) {
                try {
                    JSON.parse(text);
                    // Handle full JSON state import differently if needed
                } catch (err) {
                    alert('Erro ao ler JSON');
                }
            } else {
                const data = parseCSV(text);
                if (data.length < 2) {
                    alert('Ficheiro CSV vazio ou inválido');
                    return;
                }
                setRawData(data);

                // Auto-suggest mappings
                const headers = data[0];
                const initialMappings: ImportMapping[] = headers.map(header => {
                    const normalized = header.toLowerCase().trim();
                    let target: keyof Client | 'ignore' | 'subContact' = 'ignore';

                    if (normalized.includes('empresa') || normalized.includes('company')) target = 'companyName';
                    else if (normalized.includes('contacto') || normalized.includes('nome')) target = 'contactName';
                    else if (normalized.includes('email')) target = 'email';
                    else if (normalized.includes('tel') || normalized.includes('phone')) target = 'phone';
                    else if (normalized.includes('nif') || normalized.includes('vat')) target = 'nif';
                    else if (normalized.includes('morada') || normalized.includes('address')) target = 'address';

                    return { fileHeader: header, targetField: target };
                });

                setMappings(initialMappings);
                setStep('mapping');
            }
        };
        reader.readAsText(file);
    };

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
            clients,
            // interaction logic etc could be added here
        }, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `crm_backup_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const generatePreview = () => {
        if (!currentUser) return;
        const mapped = mapDataToClients(rawData, mappings, currentUser.id);
        setPreviewClients(mapped);
        setStep('preview');
    };

    const confirmImport = () => {
        importClients(previewClients);
        setStep('upload');
        setRawData([]);
        setMappings([]);
        setPreviewClients([]);
        alert(`${previewClients.length} clientes importados com sucesso!`);
    };

    const reset = () => {
        setStep('upload');
        setRawData([]);
        setMappings([]);
        setPreviewClients([]);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Gestão de Dados</h2>
                    <p className="text-sm text-slate-500">Importe ou exporte os seus dados do CRM</p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                    <BarChart3 className="w-4 h-4" />
                    Exportar Backup
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                {step === 'upload' && (
                    <div className="p-12 text-center">
                        <div className="mx-auto w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-4">
                            <Plus className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Importar Clientes</h3>
                        <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                            Carregue um ficheiro CSV para importar a sua base de dados de clientes existente.
                        </p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".csv"
                            onChange={handleFileUpload}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                        >
                            Selecionar Ficheiro CSV
                        </button>
                    </div>
                )}

                {step === 'mapping' && (
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-slate-900">Mapear Campos</h3>
                            <div className="flex gap-2">
                                <button onClick={reset} className="px-4 py-2 text-slate-500 hover:text-slate-700">Cancelar</button>
                                <button
                                    onClick={generatePreview}
                                    className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700"
                                >
                                    Pré-visualizar <TrendingUp className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {mappings.map((mapping, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex-1">
                                        <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Coluna no ficheiro</span>
                                        <span className="text-slate-700 font-medium">{mapping.fileHeader}</span>
                                    </div>
                                    <div className="text-slate-400">
                                        <TrendingUp className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Campo no CRM</label>
                                        <select
                                            value={mapping.targetField}
                                            onChange={(e) => {
                                                const newMappings = [...mappings];
                                                newMappings[idx].targetField = e.target.value as any;
                                                setMappings(newMappings);
                                            }}
                                            className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                                        >
                                            {clientFields.map(f => (
                                                <option key={f.value} value={f.value}>{f.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 'preview' && (
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Pré-visualização</h3>
                                <p className="text-sm text-slate-500">Confirmar {previewClients.length} registos para importar</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setStep('mapping')} className="px-4 py-2 text-slate-500 hover:text-slate-700">Voltar</button>
                                <button
                                    onClick={confirmImport}
                                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700"
                                >
                                    <Check className="w-4 h-4" /> Confirmar Importação
                                </button>
                            </div>
                        </div>

                        <div className="max-h-[400px] overflow-auto border border-slate-100 rounded-lg">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 sticky top-0 border-b border-slate-100">
                                    <tr>
                                        <th className="px-4 py-2">Empresa</th>
                                        <th className="px-4 py-2">Contacto</th>
                                        <th className="px-4 py-2">Email</th>
                                        <th className="px-4 py-2">Telefone</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {previewClients.slice(0, 10).map((c, i) => (
                                        <tr key={i}>
                                            <td className="px-4 py-2">{c.companyName || <span className="text-red-400 italic">Vazio</span>}</td>
                                            <td className="px-4 py-2">{c.contactName}</td>
                                            <td className="px-4 py-2">{c.email}</td>
                                            <td className="px-4 py-2">{c.phone}</td>
                                        </tr>
                                    ))}
                                    {previewClients.length > 10 && (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-3 text-center text-slate-400 bg-slate-50/50">
                                                E mais {previewClients.length - 10} registos...
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {previewClients.some(c => !c.companyName) && (
                            <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-center gap-2 text-amber-700 text-sm">
                                <Bell className="w-4 h-4 flex-shrink-0" />
                                Algumas linhas têm o nome da empresa em falta. Serão importadas, mas poderão estar incompletas.
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-primary-50 rounded-xl border border-primary-100 flex gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary-600 shadow-sm">
                        <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-primary-900">Dica de Importação</h4>
                        <p className="text-sm text-primary-700">Certifique-se que a primeira linha do seu CSV contém os nomes das colunas para um mapeamento automático mais preciso.</p>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-600 shadow-sm">
                        <Bell className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900">Segurança de Dados</h4>
                        <p className="text-sm text-slate-700">A importação adiciona novos dados sem apagar os existentes. Pode sempre exportar um backup antes de grandes alterações.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
