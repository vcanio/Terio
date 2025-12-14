import Link from "next/link";
import { ChevronRight, LucideIcon } from "lucide-react";

interface ToolCardProps {
  href: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  hover: string;
  disabled?: boolean;
}

export const ToolCard = ({ href, title, subtitle, description, icon: Icon, color, bg, hover, disabled }: ToolCardProps) => {
  if (disabled) {
    return (
      <div className="flex flex-col bg-white border border-slate-200 rounded-2xl p-5 md:p-6 opacity-60 grayscale-[0.5] h-full relative overflow-hidden">
        <div className="absolute top-3 right-3 bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
          Próximamente
        </div>
        <div className="flex justify-between items-start mb-4">
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-slate-100 text-slate-400`}>
            <Icon size={20} className="md:w-6 md:h-6" />
          </div>
        </div>
        <div className="mb-2">
          <h3 className="font-bold text-slate-700 text-base md:text-lg">{title}</h3>
          <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">{subtitle}</p>
        </div>
        <p className="text-xs md:text-sm text-slate-400 leading-relaxed mt-auto">{description}</p>
      </div>
    );
  }

  return (
    <Link 
      href={href}
      className={`group flex flex-col bg-white border border-slate-200 rounded-2xl p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-lg h-full ${hover}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${bg} ${color}`}>
          <Icon size={20} className="md:w-6 md:h-6" />
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-colors">
          <ChevronRight size={14} />
        </div>
      </div>
      
      <div className="mb-2">
        <h3 className="font-bold text-slate-900 text-base md:text-lg group-hover:text-blue-600 transition-colors">{title}</h3>
        <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">{subtitle}</p>
      </div>
      
      <p className="text-xs md:text-sm text-slate-500 leading-relaxed mt-auto">
        {description}
      </p>
    </Link>
  );
};