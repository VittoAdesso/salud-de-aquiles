import React from 'react';
import { Info, Thermometer, Clock, Gauge } from 'lucide-react';
import { PreparacionItem } from '../../lib/types';
import { COOKING_GUIDE } from '../../lib/diet';

interface RobotCookingGuideProps {
  activeItems: PreparacionItem[];
}

export const RobotCookingGuide: React.FC<RobotCookingGuideProps> = ({ activeItems }) => {
  // Filter relevant cooking guide items for current active recipe
  const relevantCookingGuide = COOKING_GUIDE.filter((guide) => {
    const guideName = guide.food.toLowerCase();
    return activeItems.some((item) => {
      const itName = item.ingrediente.toLowerCase();
      if (guideName.includes('merluza') && itName.includes('merluza')) return true;
      if (guideName.includes('pavo') && (itName.includes('pavo') || itName.includes('pechuga'))) return true;
      if (guideName.includes('batata') && (itName.includes('batata') || itName.includes('patata'))) return true;
      if (guideName.includes('calabac') && (itName.includes('calabacin') || itName.includes('calabaza'))) return true;
      if (guideName.includes('zanahoria') && itName.includes('zanahoria')) return true;
      return false;
    });
  });

  return (
    <div className="space-y-4">
      <div className="glass-card p-4 sm:p-5 flex items-start gap-3 border-l-4 border-l-amber-500">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
            Regla de Oro en Robot Mambo Mix Habana
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            Cocinar siempre a fuego suave al vapor o con la pala <strong>MamboMix</strong> (máximo 100–110 ºC). Nunca dorar ni freír para evitar compuestos de Maillard dañinos para los riñones y el corazón de Aquiles.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {relevantCookingGuide.map((guide) => (
          <div
            key={guide.food}
            className="glass-card p-4 flex flex-col justify-between border-t-2 border-t-emerald-600 space-y-3"
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">
                  {guide.food}
                </h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {guide.accessory}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-0.5">
                    <Thermometer className="w-3 h-3 text-red-500" />
                    <span>Temp</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {guide.temp}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-0.5">
                    <Clock className="w-3 h-3 text-emerald-500" />
                    <span>Tiempo</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {guide.time}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mb-0.5">
                    <Gauge className="w-3 h-3 text-blue-500" />
                    <span>Velocidad</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {guide.speed}
                  </span>
                </div>
              </div>

              <div className="mt-2.5 text-[11px] text-slate-500 dark:text-slate-400">
                <span>Potencia calorífica: </span>
                <strong className="text-slate-700 dark:text-slate-300">{guide.power}</strong>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-800/40 p-2.5 rounded-xl">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                Consejo de cocción:
              </span>
              {guide.notes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
