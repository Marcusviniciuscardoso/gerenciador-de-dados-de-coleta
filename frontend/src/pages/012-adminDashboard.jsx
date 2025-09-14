// pages/AdminDashboardPage.jsx
"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/UI/tabs";
import { OverviewCards } from "../components/dashboard/overview-cards";
import { ProjectsCharts } from "../components/dashboard/projects-charts.tsx";
import { CollectionsMap } from "../components/dashboard/collections-map";
import { BreadcrumbNav } from "../components/dashboard/breadcrumb";
import { SamplesOverview } from "../components/dashboard/samples-overview.tsx";
import { ImagesGallery } from "../components/dashboard/images-gallery";
import { AuditTimeline } from "../components/dashboard/audit-timeline";
import { generateDashboardData } from "../lib/dashboard-data.ts"; 
import { Button } from "../components/UI/button";
import { RefreshCw, Download, Filter } from "lucide-react";

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);

    // Simulação de carregamento
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const data = generateDashboardData();
    setDashboardData(data);
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <BreadcrumbNav
        items={[{ label: "Administração", href: "/admin" }, { label: "Dashboard" }]}
      />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">
            Visão geral completa do sistema • Última atualização:{" "}
            {lastUpdated.toLocaleTimeString("pt-BR")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Cards de Visão Geral */}
      <div className="mb-8">
        <OverviewCards data={dashboardData.overview} />
      </div>

      {/* Conteúdo Principal em Abas */}
      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="projects">🌱 Projetos</TabsTrigger>
          <TabsTrigger value="collections">🗺️ Coletas</TabsTrigger>
          <TabsTrigger value="samples">🧪 Amostras</TabsTrigger>
          <TabsTrigger value="images">📸 Imagens</TabsTrigger>
          <TabsTrigger value="audit">🔐 Auditoria</TabsTrigger>
          <TabsTrigger value="reports">📊 Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          <ProjectsCharts data={dashboardData.projects} />
        </TabsContent>

        <TabsContent value="collections" className="space-y-6">
          <CollectionsMap data={dashboardData.collections} />
        </TabsContent>

        <TabsContent value="samples" className="space-y-6">
          <SamplesOverview data={dashboardData.samples} />
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          <ImagesGallery data={dashboardData.images} />
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <AuditTimeline data={dashboardData.audit} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">Relatórios Personalizados</h3>
              <p className="text-muted-foreground mb-6">
                Gere relatórios detalhados com filtros personalizados e exportação em
                múltiplos formatos.
              </p>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Criar Relatório
              </Button>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">Análise Avançada</h3>
              <p className="text-muted-foreground mb-6">
                Acesse ferramentas de análise estatística e visualizações interativas dos
                dados.
              </p>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Análise Estatística
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
