import { useCRM } from '../context/CRMContext';
import { Card } from '../components/ui/Card';
import { PendingContactsList } from '../components/clients/PendingContactsList';
import { Users, TrendingUp, Briefcase } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, subMonths } from 'date-fns';
import { pt } from 'date-fns/locale';

export default function Dashboard() {
    const { clients, sales, opportunities } = useCRM();

    // KPIs
    const totalClients = clients.length;
    const totalSales = sales.reduce((acc, curr) => acc + curr.value, 0);
    const openOpportunities = opportunities.filter(o => o.status === 'open').length;
    const opportunityValue = opportunities.filter(o => o.status === 'open').reduce((acc, curr) => acc + curr.value, 0);

    // Chart Data: Sales by Month (Last 6 months)
    const salesByMonth = Array.from({ length: 6 }).map((_, i) => {
        const date = subMonths(new Date(), 5 - i);
        const monthKey = format(date, 'MMM', { locale: pt });
        const monthSales = sales.filter(s => {
            const sDate = new Date(s.date);
            return sDate.getMonth() === date.getMonth() && sDate.getFullYear() === date.getFullYear();
        }).reduce((acc, s) => acc + s.value, 0);

        return { name: monthKey, v: monthSales };
    });

    // Chart Data: Sales by Product Type
    const salesByType = [
        { name: 'Produto', value: sales.filter(s => s.productType === 'product').reduce((a, c) => a + c.value, 0), color: '#0ea5e9' },
        { name: 'Serviço', value: sales.filter(s => s.productType === 'service').reduce((a, c) => a + c.value, 0), color: '#6366f1' },
        { name: 'Consultoria', value: sales.filter(s => s.productType === 'consulting').reduce((a, c) => a + c.value, 0), color: '#8b5cf6' },
    ].filter(i => i.value > 0);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500">Visão geral do desempenho comercial</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Vendas Totais</p>
                        <p className="text-2xl font-bold text-slate-900">{totalSales.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</p>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-full">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Pipeline Aberto</p>
                        <p className="text-2xl font-bold text-slate-900">{openOpportunities} <span className="text-sm text-slate-400 font-normal">({opportunityValue.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })})</span></p>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                        <Briefcase className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Clientes</p>
                        <p className="text-2xl font-bold text-slate-900">{totalClients}</p>
                    </div>
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
                        <Users className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Pending Contacts & Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card title="Evolução de Vendas (Últimos 6 Meses)">
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={salesByMonth}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value: any) => `€${(value || 0) / 1000}k`} />
                                    <Tooltip formatter={(value: any) => (value || 0).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })} />
                                    <Bar dataKey="v" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                <div className="h-[400px]">
                    <PendingContactsList compact={false} />
                </div>
            </div>

            {/* Secondary Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Vendas por Tipo">
                    <div className="h-64 w-full flex items-center justify-center">
                        {salesByType.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={salesByType}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {salesByType.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: any) => (value || 0).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-slate-400">Sem dados de vendas suficientes.</p>
                        )}
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                        {salesByType.map(item => (
                            <div key={item.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-sm text-slate-600">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
