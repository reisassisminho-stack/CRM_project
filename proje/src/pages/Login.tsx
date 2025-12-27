import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Settings, Search, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { login, register } = useCRM();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            if (login(formData.email, formData.password)) {
                navigate('/');
            } else {
                setError('Credenciais inválidas');
            }
        } else {
            if (register(formData.name, formData.email, formData.password)) {
                navigate('/');
            } else {
                setError('Email já registado');
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-8 bg-slate-900 text-white text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-indigo-500/20 rounded-xl">
                            <LayoutDashboard size={40} className="text-indigo-400" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">CRM Pro</h1>
                    <p className="text-slate-400">Gestão Profissional de Clientes</p>
                </div>

                <div className="p-8">
                    <h2 className="text-xl font-semibold text-slate-800 mb-6 text-center">
                        {isLogin ? 'Bem-vindo de volta' : 'Criar Conta'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                        placeholder="Seu nome"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    placeholder="exemplo@email.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <div className="relative">
                                <Settings className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full justify-center">
                            {isLogin ? 'Entrar' : 'Registar'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            {isLogin ? 'Não tem conta? Registe-se' : 'Já tem conta? Faça login'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
