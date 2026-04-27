"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/UI/tabs";
import { OverviewCards } from "../components/dashboard/overview-cards";
import { ProjectsCharts } from "../components/dashboard/projects-charts.tsx";
import { CollectionsMap } from "../components/dashboard/collections-map";
import SamplesOverview from "../components/dashboard/samples-overview";
import { ImagesGallery } from "../components/dashboard/images-gallery";
import { generateDashboardData } from "../lib/dashboard-data.ts";
import { RefreshCw, Download, Filter } from "lucide-react";
import PageShell, { PageHeader, SectionHeading } from "../components/layout/PageShell";
import { ButterflyIcon, FernIcon, LeafIcon } from "../components/decor/Illustrations";

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => { loadDashboardData(); }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setDashboardData(generateDashboardData());
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  if (isLoading || !dashboardData) {
    return (
      <PageShell badge={{ number: '12', label: 'Painel Admin' }}>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <ButterflyIcon size={64} className="mx-auto opacity-50 animate-pulse" />
            <p className="font-script text-sage-600 text-xl mt-4">Carregando dashboard...</p>
          </div>
        </div>
      </PageShell>
    );
  }

  const { overview } = dashboardData;
  // Métricas de fallback caso overview não traga (mostrar cards do PDF)
  const stats = [
    { label: 'PESQUISADORES ATIVOS', value: overview?.usuarios?.ativos ?? 24, Icon: ButterflyIcon },
    { label: 'PROJETOS NO SISTEMA', value: overview?.projetos?.total ?? 47, Icon: FernIcon },
    { label: 'COLETAS REGISTRADAS', value: overview?.coletas?.total ?? 312, Icon: LeafIcon },
    { label: 'AMOSTRAS CATALOGADAS', value: overview?.amostras?.total ?? 1847, Icon: ButterflyIcon },
  ];

  // Mock de coletas por mês
  const coletasPorMes = MESES.map((_, i) => Math.floor(Math.random() * 40) + 10);
  const maxColetas = Math.max(...coletasPorMes);
  const mesDestaque = coletasPorMes.indexOf(maxColetas);

  const atividades = [
    { id: 1, iniciais: 'MS', nome: 'M. Silva', acao: 'registrou amostra', alvo: 'MAR-2025-009' },
    { id: 2, iniciais: 'JC', nome: 'J. Costa', acao: 'criou projeto', alvo: 'Aranhas do Cerrado' },
    { id: 3, iniciais: 'AL', nome: 'A. Lima', acao: 'exportou planilha', alvo: 'Coleobroca em Cafezais' },
    { id: 4, iniciais: 'MS', nome: 'M. Silva', acao: 'fez coleta', alvo: 'Serra do Mar — Cunha' },
  ];

  return (
    <PageShell badge={{ number: '12', label: 'Painel Admin' }}>
      <PageHeader
        overline="visão geral"
        title="Painel"
        subtitle={`Última atualização: ${lastUpdated.toLocaleTimeString('pt-BR')}`}
        onBack={() => navigate('/admin')}
        backLabel="Admin"
        actions={
          <>
            <button onClick={loadDashboardData} disabled={isLoading} className="btn-secondary">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Atualizar
            </button>
            <button className="btn-secondary"><Filter className="w-4 h-4" /> Filtros</button>
            <button className="btn-secondary"><Download className="w-4 h-4" /> Exportar</button>
          </>
        }
      />

      {/* Cards de visão geral */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((s, i) => {
          const Icon = s.Icon;
          return (
            <div key={i} className="card-notebook relative">
              <Icon size={28} className="absolute top-3 right-3 opacity-50" />
              <div className="text-[10px] tracking-widest font-semibold uppercase text-olive">{s.label}</div>
              <div className="heading-serif text-4xl mt-3">{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Coletas por mês + atividades */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 card-notebook">
          <SectionHeading overline="atividade" title="Coletas por mês" className="mb-6" />
          <div className="flex items-end gap-2 h-48 px-2">
            {coletasPorMes.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className={`w-full rounded-t ${i === mesDestaque ? 'bg-sage-600' : 'bg-sage-300'}`}
                  style={{ height: `${(v / maxColetas) * 100}%`, minHeight: '6px' }}
                />
                <span className="text-[10px] text-olive-light tracking-wider">{MESES[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-notebook">
          <SectionHeading overline="recentes" title="Últimas atividades" className="mb-5" />
          <ul className="space-y-3">
            {atividades.map((a) => (
              <li key={a.id} className="flex items-center gap-3 text-sm pb-3 border-b border-dashed border-tan last:border-b-0">
                <div className="w-9 h-9 rounded-full bg-sage-200 border border-olive/30 flex items-center justify-center text-olive-dark font-semibold text-xs shrink-0">
                  {a.iniciais}
                </div>
                <div className="flex-1 min-w-0">
                  <strong className="text-olive-dark">{a.nome}</strong>{' '}
                  <span className="text-olive-light">{a.acao}</span>{' '}
                  <span className="font-script text-sage-600">"{a.alvo}"</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Conteúdo em abas (mantém componentes existentes) */}
      <div className="card-notebook" >
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-paper border border-tan/60 rounded-md p-1">
            <TabsTrigger value="projects" className="data-[state=active]:bg-sage-300 data-[state=active]:text-olive-dark rounded">
              Projetos
            </TabsTrigger>
            <TabsTrigger value="collections" className="data-[state=active]:bg-sage-300 data-[state=active]:text-olive-dark rounded">
              Coletas
            </TabsTrigger>
            <TabsTrigger value="samples" className="data-[state=active]:bg-sage-300 data-[state=active]:text-olive-dark rounded">
              Amostras
            </TabsTrigger>
            <TabsTrigger value="images" className="data-[state=active]:bg-sage-300 data-[state=active]:text-olive-dark rounded">
              Imagens
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects"><ProjectsCharts data={dashboardData.projects} /></TabsContent>
          <TabsContent value="collections"><CollectionsMap data={dashboardData.collections} /></TabsContent>
          <TabsContent value="samples"><SamplesOverview data={dashboardData.samples} /></TabsContent>
          <TabsContent value="images"><ImagesGallery data={dashboardData.images} /></TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}
