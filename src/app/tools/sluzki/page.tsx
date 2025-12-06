import SluzkiBoard from '@/components/tools/sluzki/Board';

export default function SluzkiPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Mapa de Red (Sluzki)</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
          Guardar Mapa
        </button>
      </div>
      
      <div className="flex justify-center bg-slate-100 p-8 rounded-xl overflow-hidden shadow-inner">
        <SluzkiBoard />
      </div>
    </div>
  );
}