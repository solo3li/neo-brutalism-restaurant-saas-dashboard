import { Store, Utensils, Users, BarChart3, ShieldCheck, ArrowRight, Star, Zap, Globe, Sparkles } from "lucide-react";
import AuthForm from "../components/AuthForm";

interface LandingPageProps {
  onLogin: () => void;
}

export default function LandingPage({ onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-neo-bg font-cairo text-neo-text overflow-x-hidden" dir="rtl">
      {/* --- Navbar --- */}
      <nav className="sticky top-0 z-50 bg-white border-b-4 border-neo-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-orange neo-card-flat flex items-center justify-center text-2xl">
              🍽️
            </div>
            <span className="text-2xl font-black tracking-tighter">فودي بورد</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-black text-sm uppercase">
            <a href="#features" className="hover:text-brand-orange transition-colors">المميزات</a>
            <a href="#about" className="hover:text-brand-orange transition-colors">عن النظام</a>
            <a href="#pricing" className="hover:text-brand-orange transition-colors">الأسعار</a>
          </div>
          <a 
            href="#join"
            className="neo-btn bg-brand-yellow px-6 py-2 font-black text-sm"
          >
            ابدأ الآن
          </a>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative bg-brand-orange border-b-4 border-neo-border py-24 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center lg:text-right flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <div className="inline-block bg-white neo-card-flat px-4 py-1 font-black text-xs uppercase tracking-widest animate-bounce">
              🚀 ثورة في إدارة المطاعم
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[1.1] drop-shadow-[4px_4px_0px_#1A1A1A]">
              نظامك، <br />
              <span className="text-brand-yellow">مطعمك،</span> <br />
              نجاحك.
            </h1>
            <p className="text-xl md:text-2xl font-bold text-white/90 max-w-2xl leading-relaxed">
              توقف عن الإدارة التقليدية. فودي بورد يمنحك القوة لإدارة فروعك، موظفيك، وقائمتك بكل ذكاء ومن مكان واحد.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <a href="#join" className="neo-btn bg-brand-yellow px-10 py-5 text-xl font-black flex items-center gap-3">
                انضم إلينا الآن
                <ArrowRight size={24} />
              </a>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border-2 border-white/20 p-4 rounded-xl text-white">
                <div className="flex -space-x-2 rtl:space-x-reverse">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-neo-border bg-gray-200" />
                  ))}
                </div>
                <span className="font-bold text-sm">+1000 مطعم يثق بنا</span>
              </div>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="neo-card bg-white p-4 rotate-3 animate-float relative z-20">
              <div className="aspect-video bg-neo-bg border-2 border-neo-border flex items-center justify-center overflow-hidden">
                <div className="grid grid-cols-3 gap-2 p-4 w-full">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="h-20 bg-brand-orange/10 border-2 border-neo-border rounded-lg animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-yellow neo-card-flat -rotate-6 flex items-center justify-center text-5xl z-30">
              🍔
            </div>
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-brand-purple neo-card-flat rotate-12 flex items-center justify-center text-4xl z-30">
              ⚡
            </div>
          </div>
        </div>

        {/* Decorative background text */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none select-none flex items-center justify-center overflow-hidden">
          <span className="text-[30rem] font-black leading-none uppercase">FOODY</span>
        </div>
      </section>

      {/* --- Marquee --- */}
      <div className="bg-neo-text py-4 border-b-4 border-neo-border overflow-hidden whitespace-nowrap">
        <div className="flex gap-16 animate-marquee">
          {[1,2,3].map(i => (
            <div key={i} className="flex gap-16 items-center">
              <span className="text-brand-yellow text-2xl font-black uppercase tracking-widest flex items-center gap-4">
                <Zap fill="currentColor" /> إدارة الفروع
              </span>
              <span className="text-white text-2xl font-black uppercase tracking-widest flex items-center gap-4">
                <Star fill="currentColor" /> ذكاء اصطناعي
              </span>
              <span className="text-brand-orange text-2xl font-black uppercase tracking-widest flex items-center gap-4">
                <Globe /> وصول عالمي
              </span>
              <span className="text-white text-2xl font-black uppercase tracking-widest flex items-center gap-4">
                <Sparkles /> تجربة POS فريدة
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* --- Features Section --- */}
      <section id="features" className="py-24 px-4 max-w-7xl mx-auto">
        <div className="mb-20 text-center">
          <h2 className="text-5xl font-black mb-6">لماذا فودي بورد؟</h2>
          <p className="text-xl font-bold text-neo-text/60 max-w-3xl mx-auto leading-relaxed">
            صممنا النظام ليكون المساعد الأول لكل صاحب مطعم، من الطلب الأول حتى آخر تقرير في نهاية اليوم.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "نقطة بيع ذكية",
              desc: "واجهة POS مصممة للسرعة الفائقة، تدعم اللمس وتعمل حتى في أصعب الظروف.",
              icon: Utensils,
              color: "bg-brand-orange"
            },
            {
              title: "إدارة المخزون",
              desc: "تتبع مكوناتك بالجرام. تنبيهات ذكية عند انخفاض الكميات وهندسة ذكية للمنيو.",
              icon: Store,
              color: "bg-brand-yellow"
            },
            {
              title: "تحليلات الأداء",
              desc: "شاهد مبيعاتك وأرباحك تنمو. تقارير لحظية لكل فرع، موظف، أو صنف في القائمة.",
              icon: BarChart3,
              color: "bg-brand-purple"
            },
            {
              title: "إدارة الموظفين",
              desc: "نظام متكامل لتتبع الحضور، الأداء، والصلاحيات لكل فرد في فريق عملك.",
              icon: Users,
              color: "bg-brand-blue"
            },
            {
              title: "أمان متقدم",
              desc: "بياناتك مشفرة ومحمية. نظام صلاحيات دقيق (RBAC) يضمن وصول الأشخاص المناسبين فقط.",
              icon: ShieldCheck,
              color: "bg-brand-cyan"
            },
            {
              title: "دعم فني 24/7",
              desc: "فريقنا معك دائماً. نضمن استمرارية عملك ونجاحك في كل خطوة.",
              icon: Sparkles,
              color: "bg-brand-lime"
            }
          ].map((f, i) => (
            <div key={i} className="neo-card bg-white p-8 group hover:-translate-y-2 transition-transform cursor-default">
              <div className={`w-16 h-16 ${f.color} neo-card-flat flex items-center justify-center text-white mb-6 group-hover:rotate-6 transition-transform`}>
                <f.icon size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4">{f.title}</h3>
              <p className="font-bold text-neo-text/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Join Section --- */}
      <section id="join" className="py-24 bg-brand-yellow border-y-4 border-neo-border overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 text-center lg:text-right space-y-8 relative z-10">
            <h2 className="text-6xl font-black text-neo-text leading-tight">
              هل أنت مستعد <br />
              <span className="bg-brand-orange text-white px-4 py-2 rotate-2 inline-block shadow-[4px_4px_0px_#1A1A1A]">لنقل مطعمك</span> <br />
              إلى المستوى التالي؟
            </h2>
            <p className="text-2xl font-bold text-neo-text/70 leading-relaxed max-w-xl">
              انضم إلى مئات أصحاب المطاعم الذين وثقوا في فودي بورد لتطوير أعمالهم.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/50 border-2 border-neo-border p-6 rounded-2xl">
                <div className="text-4xl font-black mb-1">+50%</div>
                <div className="font-bold text-sm opacity-60">زيادة في كفاءة العمل</div>
              </div>
              <div className="bg-white/50 border-2 border-neo-border p-6 rounded-2xl">
                <div className="text-4xl font-black mb-1">-30%</div>
                <div className="font-bold text-sm opacity-60">تقليل في الهدر</div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-lg relative z-10">
            <AuthForm onLogin={onLogin} />
          </div>
        </div>

        {/* Floating background icons */}
        <div className="absolute top-20 right-10 text-8xl opacity-10 animate-float">🥘</div>
        <div className="absolute bottom-20 left-10 text-8xl opacity-10 animate-float-delayed">☕</div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-white py-20 px-4 border-b-8 border-brand-orange">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-orange neo-card-flat flex items-center justify-center text-3xl">
                  🍽️
                </div>
                <span className="text-3xl font-black tracking-tighter">فودي بورد</span>
              </div>
              <p className="text-xl font-bold text-neo-text/50 max-w-sm leading-relaxed">
                الجيل القادم من أنظمة إدارة المطاعم والكافيهات. صُنع بكل فخر لتمكين أصحاب الأعمال.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-black uppercase tracking-widest text-brand-orange">النظام</h4>
              <ul className="space-y-2 font-bold text-neo-text/70">
                <li><a href="#" className="hover:text-neo-text">المميزات</a></li>
                <li><a href="#" className="hover:text-neo-text">الأسعار</a></li>
                <li><a href="#" className="hover:text-neo-text">قصص النجاح</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-black uppercase tracking-widest text-brand-orange">تواصل معنا</h4>
              <ul className="space-y-2 font-bold text-neo-text/70">
                <li>المملكة العربية السعودية، الرياض</li>
                <li>info@foodyboard.com</li>
                <li>+966 50 000 0000</li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t-2 border-neo-border flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="font-black text-neo-text">
              جميع الحقوق محفوظة © {new Date().getFullYear()} فودي بورد
            </p>
            <div className="flex gap-4">
              {['Twitter', 'LinkedIn', 'Instagram'].map(s => (
                <a key={s} href="#" className="w-10 h-10 bg-neo-bg border-2 border-neo-border flex items-center justify-center font-black text-xs hover:bg-brand-yellow transition-colors">
                  {s[0]}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(3deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-15px) rotate(8deg); }
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
