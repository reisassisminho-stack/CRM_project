import { useCRM } from '../context/CRMContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Send, Mail, Zap, BarChart2, Plus, ArrowUpRight, MousePointer2, Eye, AlertCircle } from 'lucide-react';

export default function Marketing() {
    const { campaigns } = useCRM();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Marketing & Automação</h1>
                    <p className="text-slate-500">Gira campanhas de email e fluxos de trabalho</p>
                </div>
                <Button>
                    <Plus className="w-4 h-4" />
                    Nova Campanha
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-primary-600 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-primary-100 text-sm">Total Enviados</p>
                            <h3 className="text-2xl font-bold mt-1">12.480</h3>
                        </div>
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Send className="w-4 h-4" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex justify-between items-start text-slate-600">
                        <div>
                            <p className="text-slate-500 text-sm">Taxa de Abertura</p>
                            <h3 className="text-2xl font-bold mt-1">24.8%</h3>
                        </div>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Eye className="w-4 h-4" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex justify-between items-start text-slate-600">
                        <div>
                            <p className="text-slate-500 text-sm">Taxa de Clique</p>
                            <h3 className="text-2xl font-bold mt-1">3.2%</h3>
                        </div>
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <MousePointer2 className="w-4 h-4" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex justify-between items-start text-slate-600">
                        <div>
                            <p className="text-slate-500 text-sm">Bounce Rate</p>
                            <h3 className="text-2xl font-bold mt-1">0.4%</h3>
                        </div>
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                            <AlertCircle className="w-4 h-4" />
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-primary-500" />
                        Campanhas Recentes
                    </h2>

                    <div className="space-y-4">
                        {campaigns.length > 0 ? campaigns.map(campaign => (
                            <Card key={campaign.id} className="p-4">
                                {/* Campaign row implementation */}
                            </Card>
                        )) : (
                            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500">
                                Nenhuma campanha enviada recentemente.
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-500" />
                        Automações Ativas
                    </h2>

                    <Card className="p-4 border-l-4 border-l-amber-500 cursor-pointer hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-slate-900">Welcome Sequence</h4>
                            <span className="flex h-2 w-2 rounded-full bg-green-500 ring-4 ring-green-100"></span>
                        </div>
                        <p className="text-sm text-slate-500">Trigger: Lead Criado</p>
                        <div className="flex items-center gap-4 mt-4 text-xs font-semibold text-slate-400">
                            <span>3 Passos</span>
                            <span>•</span>
                            <span>142 Execuções</span>
                        </div>
                    </Card>

                    <Card className="p-4 border-l-4 border-l-slate-300 opacity-60">
                        <h4 className="font-medium text-slate-900">Follow-up Proposta</h4>
                        <p className="text-sm text-slate-500">Pausada</p>
                    </Card>

                    <Button variant="ghost" className="w-full text-primary-600 border border-primary-100">
                        Configurar Nova Automação
                    </Button>
                </div>
            </div>
        </div>
    );
}
