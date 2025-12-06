import SluzkiBoard from '@/components/tools/sluzki/Board';

export default function SluzkiPage() {
  return (
    // Simplemente un contenedor que ocupa el 100% del alto y ancho disponible
    <div className="w-full h-full bg-slate-200">
      <SluzkiBoard />
    </div>
  );
}