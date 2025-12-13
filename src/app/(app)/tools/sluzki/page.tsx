import SluzkiBoard from '@/features/sluzki/components/Board'; // <--- ESTA ES LA NUEVA RUTA

export default function SluzkiPage() {
  return (
    <div className="w-full h-full bg-slate-200">
      <SluzkiBoard />
    </div>
  );
}