import React, { useState } from "react";
import { ArrowDownToLine, Download, Search } from "lucide-react";

const initialMonthCards = [
  { label: "Todos", total: 14, value: "R$ 27.480,00" },
  { label: "Ago/2026", total: 6, value: "R$ 12.450,50" },
  { label: "Jul/2026", total: 5, value: "R$ 9.830,00" },
  { label: "Jun/2026", total: 3, value: "R$ 5.199,50" },
];

const comprovantes = [
  {
    numero: "000124",
    data: "24/08",
    emissor: "TechServiços Ltda.",
    cnpjEmissor: "12.345.678/0001-90",
    tomador: "Construtora Horizonte S.A.",
    cnpjTomador: "98.765.432/0001-10",
    valor: 3200,
    status: "Concluída",
    statusClass: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  },
  {
    numero: "000123",
    data: "23/08",
    emissor: "TechServiços Ltda.",
    cnpjEmissor: "12.345.678/0001-90",
    tomador: "Consultoria ABC ME",
    cnpjTomador: "11.222.333/0001-44",
    valor: 1500,
    status: "Concluída",
    statusClass: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  },
  {
    numero: "000122",
    data: "22/08",
    emissor: "TechServiços Ltda.",
    cnpjEmissor: "12.345.678/0001-90",
    tomador: "Auto Peças Sul",
    cnpjTomador: "33.444.555/0001-66",
    valor: 875.5,
    status: "Pendente",
    statusClass: "bg-amber-100 text-amber-700 border border-amber-200",
  },
  {
    numero: "000121",
    data: "20/08",
    emissor: "TechServiços Ltda.",
    cnpjEmissor: "12.345.678/0001-90",
    tomador: "Distribuidora Norte",
    cnpjTomador: "55.666.777/0001-88",
    valor: 4200,
    status: "Pendente",
    statusClass: "bg-amber-100 text-amber-700 border border-amber-200",
  },
  {
    numero: "000119",
    data: "18/08",
    emissor: "TechServiços Ltda.",
    cnpjEmissor: "12.345.678/0001-90",
    tomador: "Logística Rápida Ltda.",
    cnpjTomador: "99.000.111/0001-33",
    valor: 2850,
    status: "Concluída",
    statusClass: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  },
  {
    numero: "000118",
    data: "17/08",
    emissor: "TechServiços Ltda.",
    cnpjEmissor: "12.345.678/0001-90",
    tomador: "Gráfica Express",
    cnpjTomador: "22.333.444/0001-55",
    valor: 950,
    status: "Concluída",
    statusClass: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  },
];

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function Comprovantes() {
  const [selectedMonth, setSelectedMonth] = useState("Todos");

  return (
    <div className="flex-1 bg-[#f3f4f6] p-8">
      <div className="max-w-[1180px]">
        <h1 className="text-[2.1rem] font-bold tracking-[-0.04em] text-[#1f2937]">
          Comprovantes
        </h1>

        <p className="mt-3 text-[1.05rem] text-[#4b5563]">
          Notas fiscais emitidas e recebidas, organizadas por período
        </p>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="relative w-[420px] max-w-full">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
            <input
              type="text"
              placeholder="Buscar por número ou CNPJ"
              className="h-12 w-full rounded-xl border border-[#d9dfe7] bg-white pl-11 pr-4 text-sm text-[#374151] shadow-sm outline-none placeholder:text-[#6b7280] focus:border-[#7aa0ff]"
            />
          </div>

          <button className="inline-flex items-center gap-2 rounded-xl bg-[#1f2937] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#111827]">
            <Download className="h-4 w-4" />
            Baixar período (zip)
          </button>
        </div>

        <div className="mt-8 grid grid-cols-4 gap-4">
          {initialMonthCards.map((month) => {
            const isSelected = selectedMonth === month.label;

            return (
              <button
                key={month.label}
                type="button"
                onClick={() => setSelectedMonth(month.label)}
                className={[
                  "group rounded-xl border p-4 shadow-sm transition-all duration-200 ease-out",
                  "hover:-translate-y-0.5 hover:shadow-md hover:border-blue-200",
                  "focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-0",
                  "animate-in fade-in-20",
                  isSelected
                    ? "border-[#4d8ef7] bg-[#eaf2ff] shadow-[0_0_0_1px_rgba(77,142,247,0.55)]"
                    : "border-[#dfe3ea] bg-[#f9fafb] hover:bg-white",
                ].join(" ")}
              >
                <div className="text-center text-[0.95rem] font-medium text-[#4b5563]">
                  {month.label}
                </div>
                <div
                  className={[
                    "mt-3 text-center text-[2.1rem] font-bold tracking-[-0.04em] transition-colors duration-200",
                    isSelected ? "text-[#1d4ed8]" : "text-[#111827] group-hover:text-[#1d4ed8]",
                  ].join(" ")}
                >
                  {month.total}
                </div>
                <div className="mt-1 text-center text-sm text-[#4b5563]">
                  {month.value}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-[#dfe3ea] bg-white shadow-sm">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead className="bg-[#f6f7f9] text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[#7a8190]">
              <tr>
                <th className="px-5 py-4">NFS-E</th>
                <th className="px-5 py-4">Emissor</th>
                <th className="px-5 py-4">Tomador</th>
                <th className="px-5 py-4">Valor</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-center"> </th>
              </tr>
            </thead>
            <tbody>
              {comprovantes.map((item) => (
                <tr key={item.numero} className="border-t border-[#edf0f3] text-[#111827]">
                  <td className="px-5 py-4 align-top">
                    <div className="text-lg font-semibold">{item.numero}</div>
                    <div className="text-sm text-[#6b7280]">{item.data}</div>
                  </td>

                  <td className="px-5 py-4 align-top">
                    <div className="text-base font-medium">{item.emissor}</div>
                    <div className="text-sm text-[#6b7280]">{item.cnpjEmissor}</div>
                  </td>

                  <td className="px-5 py-4 align-top">
                    <div className="text-base font-medium">{item.tomador}</div>
                    <div className="text-sm text-[#6b7280]">{item.cnpjTomador}</div>
                  </td>

                  <td className="px-5 py-4 align-top">
                    <div className="text-[1.05rem] font-semibold">{currency.format(item.valor)}</div>
                  </td>

                  <td className="px-5 py-4 align-top">
                    <span className={`inline-flex rounded-md px-3 py-1 text-sm font-medium ${item.statusClass}`}>
                      {item.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 align-middle">
                    <button className="ml-auto flex h-10 w-10 items-center justify-center rounded-md border border-[#dfe3ea] bg-white text-[#4b5563] transition hover:bg-[#f3f4f6]">
                      <ArrowDownToLine className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-[#6b7280]">
          <span>Exibindo 6 de 6 comprovantes em Agosto/2026</span>
          <span>Formatos disponíveis: PDF e XML</span>
        </div>
      </div>
    </div>
  );
}

export default Comprovantes;
