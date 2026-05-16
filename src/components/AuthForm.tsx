import { useState } from "react";
import { LogIn, Mail, Lock, Store, ArrowRight, Sparkles } from "lucide-react";
import { authApi } from "../utils/api";

interface AuthFormProps {
  onLogin: () => void;
}

export default function AuthForm({ onLogin }: AuthFormProps) {
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
    <div className="w-full bg-white neo-card overflow-hidden">
      <div className="p-8">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-brand-orange neo-card-flat flex items-center justify-center text-3xl mb-4 mx-auto">
            🍽️
          </div>
          <h2 className="text-2xl font-black mb-1">
            {step === "mfa" ? "التحقق بخطوتين" : (isLogin ? "مرحباً بعودتك!" : "ابدأ رحلتك معنا")}
          </h2>
          <p className="font-bold text-neo-text/50 text-sm">
            {step === "mfa" ? "أدخل الرمز من تطبيق Authenticator" : (isLogin ? "سجل دخولك لإدارة مطعمك" : "قم بإنشاء حساب لنظامك الجديد")}
          </p>
        </div>

        {error && (
          <div className="bg-brand-red/10 border-2 border-brand-red p-3 rounded-xl mb-6 text-brand-red font-bold text-xs text-center">
            {error}
          </div>
        )}

        {step === "mfa" ? (
          <form onSubmit={handleVerifyMfa} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-black flex items-center gap-2 uppercase tracking-wider text-neo-text/60">
                <Mail size={14} />
                البريد الإلكتروني
              </label>
              <input
                disabled
                type="email"
                className="neo-input w-full bg-gray-100 cursor-not-allowed opacity-70"
                value={mfaEmail}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black flex items-center gap-2 uppercase tracking-wider text-neo-text/60">
                <Lock size={14} />
                رمز التحقق (Authenticator)
              </label>
              <input
                required
                type="text"
                placeholder="000000"
                className="neo-input w-full text-center text-xl tracking-[0.4em] font-black py-3"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                maxLength={6}
              />
              <p className="text-xs text-neo-text/60 font-bold mt-2">
                ملاحظة: يتم إنشاء رمز QR الخاص بتطبيق Authenticator من قبل مدير المطعم.
              </p>
            </div>
            <button
              disabled={loading}
              type="submit"
              className="w-full neo-btn bg-brand-orange py-4 font-black flex items-center justify-center gap-2 text-lg disabled:opacity-50"
            >
              {loading ? "جاري التحقق..." : "تأكيد الدخول"}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-black flex items-center gap-2 uppercase tracking-wider text-neo-text/60">
                  <Store size={14} />
                  اسم المطعم
                </label>
                <input
                  required
                  type="text"
                  placeholder="مطعم فودي"
                  className="neo-input w-full py-3"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-black flex items-center gap-2 uppercase tracking-wider text-neo-text/60">
                <Mail size={14} />
                البريد الإلكتروني
              </label>
              <input
                required
                type="email"
                placeholder="admin@foody.com"
                className="neo-input w-full py-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black flex items-center gap-2 uppercase tracking-wider text-neo-text/60">
                <Lock size={14} />
                كلمة المرور
              </label>
              <input
                required
                type="password"
                placeholder="••••••••"
                className="neo-input w-full py-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full neo-btn bg-brand-orange py-4 font-black flex items-center justify-center gap-2 text-lg disabled:opacity-50 mt-4"
            >
              {loading ? "جاري المعالجة..." : (isLogin ? "دخول" : "إنشاء حساب")}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t-2 border-gray-100 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="font-black text-sm flex items-center gap-2 mx-auto hover:text-brand-orange transition-colors"
          >
            {isLogin ? <Sparkles size={16} className="text-brand-yellow" /> : <LogIn size={16} />}
            {isLogin ? "سجل مطعمك الآن" : "لديك حساب؟ سجل دخولك"}
          </button>
        </div>
      </div>
    </div>
  );
}
