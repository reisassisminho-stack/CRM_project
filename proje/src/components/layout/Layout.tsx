import { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Phone, TrendingUp, BarChart3, Settings, Bell, Search } from 'lucide-react';
import { clsx } from 'clsx';
import { ClientContactSidebar } from './ClientContactSidebar';

export function Layout() {
    const location = useLocation();
    const [showContactList, setShowContactList] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Leads', href: '/leads', icon: Users },
        { name: 'Pipeline', href: '/pipeline', icon: Phone },
        { name: 'Clientes', href: '/clients', icon: Users },
        { name: 'Marketing', href: '/marketing', icon: TrendingUp },
        { name: 'Documentos', href: '/documents', icon: BarChart3 },
        { name: 'Vendas', href: '/sales', icon: TrendingUp },
        { name: 'CRM Antigo', href: '/crm', icon: Phone },
        { name: 'Settings', href: '/settings', icon: Settings },
    ];

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 fixed h-full z-10 hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-primary-600">
                        <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center font-bold text-xl">
                            C
                        </div>
                        <span className="font-bold text-xl text-slate-800">CrmPremium</span>
                    </div>
                </div>

                <nav className="p-4 space-y-1 flex-1">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={clsx(
                                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-primary-50 text-primary-700'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                )}
                            >
                                <item.icon className={clsx("w-5 h-5", isActive ? "text-primary-600" : "text-slate-400")} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100 flex-none bg-slate-50/50">
                    <button
                        onClick={() => setShowContactList(!showContactList)}
                        className={clsx(
                            "flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium transition-colors border",
                            showContactList
                                ? "bg-primary-50 text-primary-700 border-primary-200"
                                : "bg-white text-slate-600 border-slate-200 hover:border-primary-200 hover:text-primary-600"
                        )}
                    >
                        <Phone className={clsx("w-4 h-4", showContactList ? "text-primary-600" : "text-slate-400")} />
                        Contactos Pendentes
                    </button>
                </div>

                <div className="p-4 border-t border-slate-100 flex-none">
                    <button
                        onClick={() => navigate('/settings')}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        <Settings className="w-5 h-5 text-slate-400" />
                        Configurações
                    </button>
                </div>
            </aside>

            {/* Contact Sidebar Drawer */}
            {showContactList && (
                <div className="fixed top-0 bottom-0 left-64 w-80 bg-white border-r border-slate-200 z-30 shadow-xl overflow-hidden animate-in slide-in-from-left duration-200">
                    <ClientContactSidebar />
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
                {/* Header */}
                <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between">
                    <div className="text-slate-500 text-sm">
                        Hoje, {new Date().toLocaleDateString('pt-PT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Pesquisar..."
                                className="pl-10 pr-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 w-64 transition-all"
                            />
                        </div>
                        <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors text-slate-500">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden text-xs flex items-center justify-center font-bold text-slate-500">
                            TM
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
                    <Outlet />
                </div>
            </main>
        </div >
    );
}
