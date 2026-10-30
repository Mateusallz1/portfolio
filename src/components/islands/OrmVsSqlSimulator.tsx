import React, { useState } from 'react';

type QueryStrategy = 'naive' | 'prefetch' | 'raw_sql';
type DbLocation = 'local' | 'cloud';

export default function OrmVsSqlSimulator() {
  const [recordCount, setRecordCount] = useState<number>(5000);
  const [strategy, setStrategy] = useState<QueryStrategy>('prefetch');
  const [dbLocation, setDbLocation] = useState<DbLocation>('cloud');
  const [hasRedis, setHasRedis] = useState<boolean>(false);

  // Latência de rede por roundtrip (ms)
  const roundtripLatency = dbLocation === 'local' ? 0.2 : 2.8;

  // Cálculo de queries geradas
  const queryCount =
    strategy === 'naive'
      ? 1 + recordCount // 1 para a lista + 1 para cada registro (N+1)
      : strategy === 'prefetch'
      ? 2 // 1 para autores + 1 com WHERE id IN (...)
      : 1; // 1 query única agregada via JOIN

  // Tempo de execução no banco (ms)
  const baseDbExecTime =
    strategy === 'naive'
      ? recordCount * 0.15
      : strategy === 'prefetch'
      ? Math.log10(recordCount) * 4.5
      : Math.log10(recordCount) * 1.8;

  // Tempo total com rede
  const totalNetworkTime = queryCount * roundtripLatency;
  let totalLatency = baseDbExecTime + totalNetworkTime;

  // Se o Redis estiver ativo e a estratégia for otimizada, 95% de chance de cache hit
  if (hasRedis && strategy !== 'naive') {
    totalLatency = totalLatency * 0.05 + 0.8; // Custo do Redis ~0.8ms
  }

  // Consumo aproximado de memória RAM (MB)
  const memoryUsage =
    strategy === 'naive'
      ? Math.round(recordCount * 0.038) + 18
      : strategy === 'prefetch'
      ? Math.round(recordCount * 0.012) + 12
      : Math.round(recordCount * 0.003) + 8;

  // Formatação
  const formattedLatency = totalLatency < 10 ? totalLatency.toFixed(1) : Math.round(totalLatency);
  const latencyBadgeColor =
    totalLatency > 1000
      ? 'text-red-500 border-red-500/30 bg-red-500/10'
      : totalLatency > 100
      ? 'text-amber-500 border-amber-500/30 bg-amber-500/10'
      : 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10';

  return (
    <div className="my-8 rounded-lg border border-base-content/15 bg-base-200/40 p-4 sm:p-6 font-sans max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-base-content/10">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-primary font-semibold">
            ⚡ Astro Island Interativa (client:visible)
          </span>
          <h4 className="text-base font-semibold text-base-content mt-0.5">
            Simulador de Custo: Django ORM vs SQL Bruto
          </h4>
        </div>
        <div className="font-mono text-xs text-base-content/50">
          Hydrated on scroll via <code className="text-primary font-bold">client:visible</code>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
        {/* Controles */}
        <div className="space-y-4 text-xs min-w-0">
          <div>
            <div className="flex flex-wrap justify-between items-center gap-1 mb-1.5">
              <label htmlFor="records-slider" className="font-medium text-base-content/80">
                Volume de Registros:
              </label>
              <span className="font-mono font-bold text-base-content">
                {recordCount.toLocaleString('pt-BR')} registros
              </span>
            </div>
            <input
              id="records-slider"
              type="range"
              min="500"
              max="50000"
              step="500"
              value={recordCount}
              onChange={(e) => setRecordCount(Number(e.target.value))}
              className="range range-xs range-primary w-full"
            />
          </div>

          <div>
            <label className="font-medium text-base-content/80 block mb-1.5">
              Estratégia de Consulta:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => setStrategy('naive')}
                className={`px-3 py-2 rounded border text-center transition-colors ${
                  strategy === 'naive'
                    ? 'border-red-500 bg-red-500/15 text-red-500 font-bold'
                    : 'border-base-content/15 hover:bg-base-200 text-base-content/70'
                }`}
              >
                N+1 Naive
              </button>
              <button
                type="button"
                onClick={() => setStrategy('prefetch')}
                className={`px-3 py-2 rounded border text-center transition-colors ${
                  strategy === 'prefetch'
                    ? 'border-primary bg-primary/15 text-primary font-bold'
                    : 'border-base-content/15 hover:bg-base-200 text-base-content/70'
                }`}
              >
                prefetch_related
              </button>
              <button
                type="button"
                onClick={() => setStrategy('raw_sql')}
                className={`px-3 py-2 rounded border text-center transition-colors ${
                  strategy === 'raw_sql'
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-500 font-bold'
                    : 'border-base-content/15 hover:bg-base-200 text-base-content/70'
                }`}
              >
                JOIN + Index
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-base-content/80 text-xs">Local do Banco:</span>
              <button
                type="button"
                onClick={() => setDbLocation(dbLocation === 'local' ? 'cloud' : 'local')}
                className="font-mono text-[11px] px-2 py-1 rounded border border-base-content/20 hover:border-base-content/40 transition-colors"
              >
                {dbLocation === 'local' ? '💻 Local (0.2ms)' : '☁️ Cloud RDS (2.8ms)'}
              </button>
            </div>

            <label className="flex items-center gap-2 cursor-pointer font-mono text-[11px]">
              <input
                type="checkbox"
                checked={hasRedis}
                onChange={(e) => setHasRedis(e.target.checked)}
                className="checkbox checkbox-xs checkbox-primary"
              />
              <span>Redis Cache</span>
            </label>
          </div>
        </div>

        {/* Painel de Resultados */}
        <div className="flex flex-col justify-between rounded-md border border-base-content/10 bg-base-100 p-4 font-mono text-xs max-w-full min-w-0">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <span className="text-base-content/60 text-[11px] sm:text-xs">Total de Queries disparadas:</span>
              <span className={`font-bold ${queryCount > 100 ? 'text-red-500' : 'text-base-content'}`}>
                {queryCount.toLocaleString('pt-BR')} queries
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-1">
              <span className="text-base-content/60 text-[11px] sm:text-xs">Consumo de Memória (Python):</span>
              <span className="text-base-content font-medium">~{memoryUsage} MB</span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-1">
              <span className="text-base-content/60 text-[11px] sm:text-xs">Roundtrip de Rede acumulado:</span>
              <span className="text-base-content font-medium">
                {strategy === 'naive'
                  ? `${(totalNetworkTime / 1000).toFixed(2)}s`
                  : `${totalNetworkTime.toFixed(1)}ms`}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-base-content/10 mt-3 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-base-content">Latência Estimada:</span>
            <div className={`px-2.5 py-1 rounded border font-bold text-sm shrink-0 ${latencyBadgeColor}`}>
              {totalLatency > 1000
                ? `${(Number(formattedLatency) / 1000).toFixed(2)} s`
                : `${formattedLatency} ms`}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-base-content/10 text-[11px] font-mono text-base-content/60 leading-relaxed">
        {strategy === 'naive' && (
          <span className="text-red-400">
            ⚠️ Gargalo crítico: O loop em Python força uma ida e volta ao banco para cada objeto, tornando a latência de rede o fator dominante.
          </span>
        )}
        {strategy === 'prefetch' && (
          <span className="text-primary">
            ✓ Resolução idiomática do Django: Reduz as requisições para apenas 2 consultas agrupadas com cláusula IN.
          </span>
        )}
        {strategy === 'raw_sql' && (
          <span className="text-emerald-400">
            ⚡ Performance bruta máxima: 1 única consulta agregada delegada 100% ao motor do banco de dados (PostgreSQL).
          </span>
        )}
      </div>
    </div>
  );
}
