/* eslint-disable react-hooks/incompatible-library */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Target } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { THEME, LEVELS } from "../utils/constants";
import { NodeType, NetworkLevel } from "../types";
import { NetworkLevelSchema, NodeTypeSchema } from "../schemas";
import { useSluzkiStore } from "../store/useSluzkiStore";

// Esquema específico para el formulario
const CreateNodeSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  type: NodeTypeSchema,
  level: NetworkLevelSchema,
});

type CreateNodeForm = z.infer<typeof CreateNodeSchema>;

interface AddNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateNodeForm) => void;
}

export const AddNodeModal = ({ isOpen, onClose, onSubmit }: AddNodeModalProps) => {
  // Obtenemos los últimos valores utilizados del Store
  const { lastNodeType, lastNodeLevel } = useSluzkiStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateNodeForm>({
    resolver: zodResolver(CreateNodeSchema),
    defaultValues: {
      name: "",
      type: "family",
      level: 1,
    },
  });

  // Efecto: Cuando se abre el modal, cargamos los valores recordados
  useEffect(() => {
    if (isOpen) {
      reset({
        name: "", // El nombre siempre empieza vacío
        type: lastNodeType, // Usamos el último tipo seleccionado
        level: lastNodeLevel, // Usamos el último nivel seleccionado
      });
    }
  }, [isOpen, lastNodeType, lastNodeLevel, reset]);

  const currentType = watch("type");
  const currentLevel = watch("level");

  const onFormSubmit = (data: CreateNodeForm) => {
    onSubmit(data);
    // Reseteamos solo el nombre para que visualmente se limpie antes de cerrar,
    // aunque el useEffect lo sobrescribirá al abrir de nuevo.
    reset({ ...data, name: "" });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Agregar a la Red">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
        
        {/* Input Nombre */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nombre</label>
          <input
            {...register("name")}
            autoFocus
            placeholder="Ej: María Pérez"
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
        </div>

        {/* Selector de Tipo (Cuadrante) */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cuadrante</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(THEME).map(([key, style]) => {
              const isSelected = currentType === key;
              const Icon = style.icon;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setValue("type", key as NodeType)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all text-left ${
                    isSelected
                      ? `${style.bg} ${style.border} ${style.text} ring-1 ring-offset-1 ring-transparent`
                      : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={16} className={isSelected ? style.text : "opacity-70"} />
                  <span className="text-xs font-bold">{style.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selector de Nivel */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nivel de Cercanía</label>
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((lvl) => {
              const isSelected = currentLevel === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setValue("level", lvl as NetworkLevel)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-slate-800 text-white border-slate-800 shadow-md"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isSelected ? "bg-white text-slate-900" : "bg-slate-100 text-slate-500"}`}>
                      {lvl}
                    </div>
                    <span className="text-xs font-bold uppercase">{LEVELS[lvl as NetworkLevel].label}</span>
                  </div>
                  {isSelected && <Target size={16} className="text-blue-400" />}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className={`w-full py-4 rounded-xl font-bold text-sm shadow-xl shadow-blue-900/5 mt-2 flex items-center justify-center gap-2 transition-all ${
            !isValid ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-slate-800 active:scale-95"
          }`}
        >
          <Plus size={20} strokeWidth={2.5} /> Agregar al Mapa
        </button>
      </form>
    </Modal>
  );
};