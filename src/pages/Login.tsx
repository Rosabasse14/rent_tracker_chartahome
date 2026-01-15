
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowRight, Mail, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { translations } from '@/utils/translations';

const Login = () => {
    const { login, language } = useAuth();
    const t = translations[language];
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error(language === 'fr' ? "Veuillez entrer votre email" : "Please enter your email");
            return;
        }

        setIsLoading(true);
        try {
            const success = await login(email);
            if (success) {
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            toast.error(language === 'fr' ? "Une erreur inattendue est survenue" : "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-white p-4">
                <div className="w-full max-w-md text-center space-y-6">
                    <div className="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                        <Mail className="w-10 h-10 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold">{language === 'fr' ? "Vérifiez vos emails" : "Check your email"}</h1>
                    <p className="text-slate-400">{language === 'fr' ? "Nous avons envoyé un lien magique à" : "We've sent a magic link to"} <span className="text-white font-bold">{email}</span>.</p>
                    <Button variant="outline" onClick={() => setSent(false)} className="mt-4">{language === 'fr' ? "Retour" : "Back to Login"}</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-white p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-tr from-primary to-indigo-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl shadow-primary/20 transform hover:rotate-12 transition-transform duration-500">
                        <Building2 className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-black mb-3 tracking-tighter">{t.welcome_back}</h1>
                    <p className="text-slate-400 font-medium">{t.enter_email}</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-6">

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">{t.work_email}</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <Input
                                    type="email"
                                    placeholder={language === 'fr' ? "nom@entreprise.com" : "name@company.com"}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary focus:border-primary text-lg transition-all"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-black shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group transition-all"
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    {t.login_button}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                <div className="mt-10 text-center">
                    <p className="text-sm text-slate-500 font-medium tracking-tight">
                        {language === 'fr' ? "Vous n'avez pas de compte ?" : "Don't have an account?"} <span className="text-primary font-bold cursor-pointer hover:underline">{language === 'fr' ? "Contactez votre gestionnaire" : "Contact your property manager"}</span>
                    </p>
                </div>

                <div className="mt-8 flex justify-center gap-4 opacity-40">
                    <div className="h-[1px] w-12 bg-slate-500 my-auto"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Secure Access</span>
                    <div className="h-[1px] w-12 bg-slate-500 my-auto"></div>
                </div>
            </div>
        </div>
    );
};

export default Login;
