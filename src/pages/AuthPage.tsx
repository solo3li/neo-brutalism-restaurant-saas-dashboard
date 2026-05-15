import { useState } from "react";
import { LogIn, UserPlus, Mail, Lock, Store, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { authApi } from "../utils/api";

interface AuthPageProps {
  onLogin: () => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const response = await authApi.login({ email, password });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("tenantId", response.data.tenant.id);
        localStorage.setItem("userName", response.data.tenant.name);
        onLogin();
      } else {
        // Register not implemented in backend yet, just mock success for now
        setTimeout(() => {
          setLoading(false);
          setIsLogin(true);
        }, 1000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "فشل تسجيل الدخول. يرجى التحقق من البيانات.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#020617] font-cairo" dir="rtl">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-orange/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-blue/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-brand-purple/10 blur-[100px] rounded-full"></div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-[440px] px-4">
        <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-[32px] p-8 md:p-10 shadow-2xl overflow-hidden relative group">
          {/* Top accent glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-brand-orange to-transparent"></div>

          {/* Logo Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-orange to-brand-pink rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg shadow-brand-orange/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
              🍽️
            </div>
            <h1 className="text-white text-3xl font-black tracking-tight mb-2">فودي بورد</h1>
            <p className="text-white/50 font-bold text-sm">
              {isLogin ? 'مرحباً بك مجدداً في نظام الإدارة' : 'ابدأ رحلة نجاح مطعمك اليوم'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-bold text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-white/70 text-xs font-bold mr-1">اسم المطعم</label>
                <div className="relative group">
                  <Store className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-brand-orange transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="مثال: مطعم السحاب"
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-3.5 pr-12 pl-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange/50 transition-all font-bold"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-white/70 text-xs font-bold mr-1">البريد الإلكتروني</label>
              <div className="relative group">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-brand-orange transition-colors" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@restaurant.com"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-3.5 pr-12 pl-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange/50 transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center mr-1">
                <label className="text-white/70 text-xs font-bold">كلمة المرور</label>
                {isLogin && <button type="button" className="text-brand-orange text-[10px] font-black hover:underline">نسيت كلمة المرور؟</button>}
              </div>
              <div className="relative group">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-brand-orange transition-colors" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-3.5 pr-12 pl-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange/50 transition-all font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-orange to-brand-pink text-white font-black py-4 rounded-2xl shadow-xl shadow-brand-orange/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 relative overflow-hidden group/btn"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}</span>
                  {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                </>
              )}
              {/* Shine effect */}
              <div className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </button>
          </form>

          {/* Switch Section */}
          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-white/40 text-sm font-bold">
              {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-white font-black mr-2 hover:text-brand-orange transition-colors flex items-center gap-1 inline-flex"
              >
                {isLogin ? 'سجل الآن' : 'سجل دخولك'}
                {isLogin ? <ArrowLeft size={14} className="mt-0.5" /> : <ArrowRight size={14} className="mt-0.5" />}
              </button>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-white/20 mb-2">
            <Sparkles size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Premium Management Suite</span>
          </div>
          <p className="text-white/20 text-xs font-bold">© 2026 فودي بورد. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </div>
  );
}
