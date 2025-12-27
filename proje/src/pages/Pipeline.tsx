import { useCRM } from '../context/CRMContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus, DollarSign, Calendar, MoreHorizontal } from 'lucide-react';

export default function Pipeline() {
    const { opportunities, settings, clients, updateOpportunity } = useCRM();
    const stages = settings.pipelineStages;

    const getClientName = (id: string) => clients.find(c => c.id === id)?.companyName || 'Cliente desconhecido';

    return (
        <div className="space-y-6 flex flex-col h-[calc(100vh-120px)]">
            <div className="flex items-center justify-between flex-none">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Pipeline de Vendas</h1>
                    <p className="text-slate-500">Acompanhe o progresso das suas oportunidades</p>
                </div>
                <div className="flex gap-2">
                    <div className="px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm text-sm">
                        <span className="text-slate-500">Valor Total:</span>
                        <span className="ml-2 font-bold text-primary-600">
                            € {opportunities.reduce((acc, current) => acc + current.value, 0).toLocaleString('pt-PT')}
                        </span>
                    </div>
                    <Button>
                        <Plus className="w-4 h-4" />
                        Nova Oportunidade
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto pb-4">
                <div className="flex h-full gap-4 min-w-[1200px]">
                    {stages.map(stage => {
                        const stageOpps = opportunities.filter(o => o.stage === stage.id);
                        const stageValue = stageOpps.reduce((acc, curr) => acc + curr.value, 0);

                        return (
                            <div key={stage.id} className="w-80 flex flex-col gap-4">
                                <div className="flex items-center justify-between px-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-slate-800">{stage.name}</h3>
                                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold">
                                            {stageOpps.length}
                                        </span>
                                    </div>
                                    <span className="text-xs font-medium text-slate-400">
                                        € {stageValue.toLocaleString('pt-PT')}
                                    </span>
                                </div>

                                <div className={`flex-1 rounded-xl p-2 space-y-3 bg-slate-50/50 border border-slate-200/60 overflow-y-auto`}>
                                    {stageOpps.map(opp => (
                                        <Card key={opp.id} className="p-3 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing">
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-medium text-slate-900 line-clamp-2">{opp.title}</h4>
                                                    <button className="p-1 hover:bg-slate-100 rounded">
                                                        <MoreHorizontal className="w-4 h-4 text-slate-400" />
                                                    </button>
                                                </div>

                                                <p className="text-xs text-slate-500 font-medium">{getClientName(opp.clientId)}</p>

                                                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                                    <div className="flex items-center text-primary-600 font-bold text-sm">
                                                        <DollarSign className="w-3 h-3" />
                                                        {opp.value.toLocaleString('pt-PT')}
                                                    </div>
                                                    {opp.expectedDate && (
                                                        <div className="flex items-center gap-1 text-[10px] text-slate-400 uppercase font-bold">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(opp.expectedDate).toLocaleDateString('pt-PT', { month: 'short', day: 'numeric' })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                    {stageOpps.length === 0 && (
                                        <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center">
                                            <p className="text-xs text-slate-400">Sem oportunidades</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
