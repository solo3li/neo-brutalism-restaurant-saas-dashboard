import { useState } from "react";
import { LogIn, UserPlus, Mail, Lock, Store, ArrowRight, ArrowLeft, Sparkles, UserCheck } from "lucide-react";
import { authApi } from "../utils/api";

interface AuthPageProps {
  onLogin: () => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<"auth" | "mfa">("auth");
  const [mfaCode, setMfaCode] = useState("");
  const [mfaEmail, setMfaEmail] = useState("");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        const response = await authApi.login({ email, password });
        
        if (response.data.requiresTwoFactor) {
           setMfaEmail(email);
           setStep("mfa");
           setLoading(false);
           return;
        }

        const token = response.data.token;
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        localStorage.setItem("token", token);
        localStorage.setItem("tenantId", response.data.tenant.id);
        localStorage.setItem("tenantSubdomain", response.data.tenant.subdomain);
        localStorage.setItem("userName", response.data.tenant.name);
        localStorage.setItem("userRole", role);
        
        const loginUrl = response.data.tenant.loginUrl;
        const currentUrl = window.location.href;

        if (loginUrl && !currentUrl.startsWith(loginUrl)) {
            const redirectUrl = new URL(loginUrl);
            redirectUrl.searchParams.set("token", token);
            redirectUrl.searchParams.set("tenantSubdomain", response.data.tenant.subdomain);
            redirectUrl.searchParams.set("userName", response.data.tenant.name);
            redirectUrl.searchParams.set("userRole", role);
            redirectUrl.searchParams.set("tenantId", response.data.tenant.id);
            window.location.replace(redirectUrl.toString());
        } else {
            onLogin();
        }
      } else {
        const response = await authApi.register({
          restaurantName,
          email,
          password,
          fullName: restaurantName 
        });
        const token = response.data.token;
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        localStorage.setItem("token", token);
        localStorage.setItem("tenantId", response.data.tenant.id);
        localStorage.setItem("tenantSubdomain", response.data.tenant.subdomain);
        localStorage.setItem("userName", response.data.tenant.name);
        localStorage.setItem("userRole", role);
        
        const loginUrl = response.data.tenant.loginUrl;
        
        if (loginUrl) {
            const redirectUrl = new URL(loginUrl);
            redirectUrl.searchParams.set("token", token);
            redirectUrl.searchParams.set("tenantSubdomain", response.data.tenant.subdomain);
            redirectUrl.searchParams.set("userName", response.data.tenant.name);
            redirectUrl.searchParams.set("userRole", role);
            redirectUrl.searchParams.set("tenantId", response.data.tenant.id);
            window.location.replace(redirectUrl.toString());
        } else {
            onLogin();
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "حدث خطأ ما");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.verifyMfa({ email: mfaEmail, code: mfaCode });
      const token = response.data.token;
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      localStorage.setItem("token", token);
      localStorage.setItem("tenantId", response.data.tenant.id);
      localStorage.setItem("tenantSubdomain", response.data.tenant.subdomain);
      localStorage.setItem("userName", response.data.tenant.name);
      localStorage.setItem("userRole", role);
      
      const loginUrl = response.data.tenant.loginUrl;
      const currentUrl = window.location.href;

      if (loginUrl && !currentUrl.startsWith(loginUrl)) {
          const redirectUrl = new URL(loginUrl);
          redirectUrl.searchParams.set("token", token);
          redirectUrl.searchParams.set("tenantSubdomain", response.data.tenant.subdomain);
          redirectUrl.searchParams.set("userName", response.data.tenant.name);
          redirectUrl.searchParams.set("userRole", role);
          redirectUrl.searchParams.set("tenantId", response.data.tenant.id);
          window.location.replace(redirectUrl.toString());
      } else {
          onLogin();
      }
    } catch (err: any) {
      setError("رمز التحقق غير صحيح");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-yellow flex items-center justify-center p-4 font-cairo" dir="rtl">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white neo-card overflow-hidden">
        {/* Left Side: Form */}
        <div className="p-8 sm:p-12">
          <div className="mb-10">
            <div className="w-16 h-16 bg-brand-orange neo-card-flat flex items-center justify-center text-3xl mb-4">
              🍽️
            </div>
            <h1 className="text-3xl font-black mb-2">
              {step === "mfa" ? "التحقق بخطوتين" : (isLogin ? "مرحباً بعودتك!" : "ابدأ رحلتك معنا")}
            </h1>
            <p className="font-bold text-neo-text/50">
              {step === "mfa" ? "أدخل الرمز من تطبيق Google Authenticator" : (isLogin ? "سجل دخولك لإدارة مطعمك بكفاءة" : "قم بإنشاء حساب لنظام إدارة المطاعم الخاص بك")}
            </p>
          </div>

          {error && (
            <div className="bg-brand-red/10 border-2 border-brand-red p-4 rounded-xl mb-6 text-brand-red font-bold text-sm">
              {error}
            </div>
          )}

          {step === "mfa" ? (
            <form onSubmit={handleVerifyMfa} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-black flex items-center gap-2">
                  <Lock size={16} className="text-brand-orange" />
                  رمز التحقق
                </label>
                <input
                  required
                  type="text"
                  placeholder="000000"
                  className="neo-input w-full text-center text-2xl tracking-[0.5em] font-black"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  maxLength={6}
                />
              </div>
              <button
                disabled={loading}
                type="submit"
                className="w-full neo-btn bg-brand-orange py-4 font-black flex items-center justify-center gap-2 text-lg disabled:opacity-50"
              >
                {loading ? "جاري التحقق..." : "تأكيد الدخول"}
                {!loading && <ArrowRight size={20} />}
              </button>
              <button
                type="button"
                onClick={() => setStep("auth")}
                className="w-full text-center font-bold text-neo-text/60 hover:text-neo-text"
              >
                العودة لتسجيل الدخول
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-black flex items-center gap-2">
                    <Store size={16} className="text-brand-orange" />
                    اسم المطعم
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="مطعم فودي"
                    className="neo-input w-full"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-black flex items-center gap-2">
                  <Mail size={16} className="text-brand-orange" />
                  البريد الإلكتروني
                </label>
                <input
                  required
                  type="email"
                  placeholder="admin@foody.com"
                  className="neo-input w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black flex items-center gap-2">
                  <Lock size={16} className="text-brand-orange" />
                  كلمة المرور
                </label>
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="neo-input w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full neo-btn bg-brand-orange py-4 font-black flex items-center justify-center gap-2 text-lg disabled:opacity-50"
              >
                {loading ? "جاري المعالجة..." : (isLogin ? "دخول" : "إنشاء حساب")}
                {!loading && <ArrowRight size={20} />}
              </button>
            </form>
          )}

          {step === "auth" && (
            <div className="mt-8 pt-8 border-t-2 border-gray-100 text-center">
              <p className="font-bold text-neo-text/60 mb-4">
                {isLogin ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}
              </p>
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="neo-btn bg-gray-50 px-8 py-3 font-black flex items-center gap-2 mx-auto"
              >
                {isLogin ? <UserPlus size={18} /> : <LogIn size={18} />}
                {isLogin ? "سجل مطعمك الآن" : "سجل دخولك"}
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Features */}
        <div className="hidden lg:flex bg-neo-bg border-r-2 border-neo-border p-12 flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-8 leading-tight">
              نظام واحد متكامل<br />
              <span className="text-brand-orange">لإدارة مطعمك</span> بكل ذكاء
            </h2>
            
            <div className="space-y-6">
              {[
                { title: "إدارة الفروع", desc: "تتبع أداء جميع فروعك من مكان واحد وفي الوقت الفعلي.", icon: Store },
                { title: "نظام POS سريع", icon: ShoppingBag, desc: "نقطة بيع متطورة مصممة للسرعة وسهولة الاستخدام." },
                { title: "تحليلات متقدمة", icon: BarChart3, desc: "تقارير مفصلة عن المبيعات، المخزون، وأداء الموظفين." },
                { title: "الأدوار والصلاحيات", icon: ShieldCheck, desc: "نظام RBAC متطور لتخصيص وصول الموظفين." }
              ].map((f, i) => (
                <div key={i} className="flex gap-4 items-start group">
                  <div className="w-12 h-12 bg-white neo-card-flat shrink-0 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors">
                    <f.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg">{f.title}</h3>
                    <p className="font-bold text-neo-text/40 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-10">
            <div className="neo-card bg-brand-purple p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={20} className="text-brand-yellow" />
                <span className="text-[10px] font-black uppercase tracking-widest">Premium Management Suite</span>
              </div>
              <p className="text-white/20 text-xs font-bold">© 2026 فودي بورد. جميع الحقوق محفوظة.</p>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -right-32 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
import { ShoppingBag, BarChart3, ShieldCheck } from "lucide-react";
