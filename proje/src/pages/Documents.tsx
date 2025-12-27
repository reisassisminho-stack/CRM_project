import { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FileText, Upload, Search, Download, Trash2, Clock, Tag } from 'lucide-react';

export default function Documents() {
    const { documents, clients } = useCRM();
    const [searchTerm, setSearchTerm] = useState('');

    const getClientName = (id?: string) => id ? clients.find(c => c.id === id)?.companyName : 'Geral';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Documentos</h1>
                    <p className="text-slate-500">Repositório central de propostas e contratos</p>
                </div>
                <Button>
                    <Upload className="w-4 h-4" />
                    Carregar Ficheiro
                </Button>
            </div>

            <Card className="p-4">
                <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Pesquisar por nome, cliente ou tipo..."
                        className="input-field pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.length > 0 ? documents.map(doc => (
                    <Card key={doc.id} className="p-4 hover:shadow-md transition-all group">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-slate-900 truncate" title={doc.name}>{doc.name}</h3>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                    <Tag className="w-3 h-3" />
                                    {getClientName(doc.clientId)}
                                </p>
                                <div className="flex items-center gap-3 mt-3">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                                        v{doc.version}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(doc.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-primary-600">
                                <Download className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-red-600">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </Card>
                )) : (
                    <div className="col-span-full py-20 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p>Ainda não foram carregados documentos.</p>
                        <p className="text-sm">Propostas e contratos aparecerão aqui.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
