"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Network, 
  ClipboardCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ChevronRight
} from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    // Simulación de llamada a API
    setTimeout(() => {
      toast.success("¡Gracias! Te avisaremos cuando estemos listos.");
      setEmail("");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100">
      <Toaster position="bottom-center" />

      {/* NAV */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight flex items-center gap-2">
            Terio<span className="text-blue-600">.</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] uppercase font-bold border border-blue-100">Beta</span>
          </div>
          <div className="flex gap-4">
            {/* Este botón lleva a la app actual */}
            <Link href="/dashboard" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              Herramientas
            </Link>
            <Link href="/dashboard" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
              Ingresar
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-medium text-slate-600 mb-4"
          >
            <Sparkles size={14} className="text-amber-500" />
            <span>La evolución de la Terapia Ocupacional</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]"
          >
            Menos papeleo.<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
              Más intervención.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed"
          >
            Terio digitaliza tus herramientas clínicas esenciales. 
            Crea Mapas de Red interactivos y evalúa con el Cuestionario Volitivo (VQ) 
            en segundos, generando reportes automáticos.
          </motion.p>

          {/* WAITLIST FORM */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mt-8"
          >
            <input 
              type="email" 
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white shadow-sm"
            />
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 disabled:opacity-70 flex items-center justify-center gap-2 whitespace-nowrap group"
            >
              {loading ? "Registrando..." : "Unirse a la lista"}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </motion.div>
          <p className="text-xs text-slate-400 font-medium">Únete a otros 120+ terapeutas interesados.</p>
        </div>
      </section>

      {/* PREVIEW IMAGE / GRAPHIC */}
      <section className="px-4 mb-20">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-blue-900/5 overflow-hidden p-2 md:p-4">
            <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden aspect-video relative group">
                
                {/* --- AQUÍ ESTÁ EL CAMBIO --- */}
                <Image 
                  src="/dashboard.png" // Asegúrate que el nombre coincida con tu archivo en public/
                  alt="Vista previa del Dashboard de Terio"
                  fill
                  className="object-cover object-top" // object-top alinea la imagen arriba
                  priority // Carga prioritaria para mejorar el rendimiento visual
                />

                {/* Overlay decorativo (opcional, puedes dejarlo o quitarlo) */}
                <div className="absolute inset-0 bg-linear-to-t from-white/10 to-transparent pointer-events-none"></div>
            </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Herramientas disponibles hoy</h2>
            <p className="text-slate-500">Todo lo que necesitas para profesionalizar tus registros.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Network className="text-blue-600" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Mapa de Red de Sluzki</h3>
              <p className="text-slate-500 leading-relaxed mb-6">
                Olvídate de dibujar círculos a mano. Crea mapas de red limpios, edítalos dinámicamente y expórtalos en imagen o PDF para la ficha clínica.
              </p>
              <ul className="space-y-3">
                {['Interfaz "Drag & Drop"', 'Cálculo automático de niveles', 'Exportación lista para imprimir'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm text-slate-600">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> {item}
                    </li>
                ))}
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mb-6 group-hover:scale-110 transition-transform duration-300">
                <ClipboardCheck className="text-emerald-600" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Cuestionario Volitivo (VQ)</h3>
              <p className="text-slate-500 leading-relaxed mb-6">
                Evalúa la volición en distintos ambientes. Registra observaciones, puntajes y genera gráficos de progreso automáticamente.
              </p>
              <ul className="space-y-3">
                {['Puntaje en tiempo real', 'Notas cualitativas por ítem', 'Gráfico de perfil volitivo'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm text-slate-600">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> {item}
                    </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER SIMPLE */}
      <footer className="py-12 px-6 border-t border-slate-200 bg-slate-50 text-center">
        <div className="flex items-center justify-center gap-2 mb-4 font-bold text-xl tracking-tight">
            Terio<span className="text-blue-600">.</span>
        </div>
        <p className="text-slate-400 text-sm mb-8">
            Hecho con ❤️ para Terapeutas Ocupacionales. <br />
            Santiago, Chile.
        </p>
        <div className="flex justify-center gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-slate-900">Contacto</a>
            <a href="#" className="hover:text-slate-900">Twitter</a>
            <a href="#" className="hover:text-slate-900">LinkedIn</a>
        </div>
      </footer>
    </div>
  );
}