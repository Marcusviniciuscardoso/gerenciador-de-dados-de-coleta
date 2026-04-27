import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell, { PageHeader } from '../components/layout/PageShell';
import { ButterflyIcon, FernIcon, LeafIcon, FlowerIcon } from '../components/decor/Illustrations';

const dataMock = {
  cards: {
    usuarios: { total: 5, ativos: 4 },
    projetos: { total: 3, ativos: 3 },
    coletas: { total: 45 },
  },
};

export default function Admin() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => { setData(dataMock); setLoading(false); }, 400);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <PageShell badge={{ number: '11', label: 'Admin' }}>
        <p className="font-script text-sage-600 text-xl">Carregando...</p>
      </PageShell>
    );
  }

  const cards = [
    {
      title: 'Painel geral',
      subtitle: 'Métricas, projetos e atividade recente.',
      icon: FernIcon,
      onClick: () => navigate('/admin/dashboard'),
    },
    {
      title: 'Usuários',
      subtitle: 'Gerenciar pesquisadores cadastrados.',
      icon: ButterflyIcon,
      onClick: () => navigate('/admin/usuarios'),
    },
  ];

  return (
    <PageShell badge={{ number: '11', label: 'Admin' }}>
      <PageHeader
        overline="área restrita"
        title="Administração"
        onBack={() => navigate(-1)}
      />

      <div className="grid md:grid-cols-2 gap-6">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <button
              key={i}
              onClick={c.onClick}
              className="bg-paper-light border border-tan/60 rounded-lg shadow-card hover:shadow-notebook transition text-left overflow-hidden"
            >
              <div className="bg-paper relative px-6 py-10 border-b border-tan/40 flex items-center justify-center">
                <LeafIcon size={28} className="absolute top-3 left-3 opacity-30" />
                <FlowerIcon size={22} className="absolute top-3 right-3 opacity-30" />
                <Icon size={70} />
              </div>
              <div className="p-6">
                <h3 className="heading-serif text-xl mb-1">{c.title}</h3>
                <p className="text-sm text-olive-light/80">{c.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>
    </PageShell>
  );
}
