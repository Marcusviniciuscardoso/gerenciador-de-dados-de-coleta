import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "@headlessui/react";
import PageShell, { PageHeader } from "../components/layout/PageShell";

function getInitials(nome) {
  if (!nome) return '??';
  const parts = nome.replace(/^(Dr\.?a?\.?|Prof\.?)\s+/i, '').trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
}

export default function UserManagement() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');

  const usuarios = [
    { id: 1, nome: 'Maria Silva', email: 'maria@usp.br', funcao: 'Doutoranda', instituicao: 'USP', status: 'Ativo', projetos: 6 },
    { id: 2, nome: 'João Costa', email: 'joao@unicamp.br', funcao: 'Pesquisador', instituicao: 'Unicamp', status: 'Ativo', projetos: 3 },
    { id: 3, nome: 'Ana Lima', email: 'ana@ufmg.br', funcao: 'Professora', instituicao: 'UFMG', status: 'Ativo', projetos: 4 },
    { id: 4, nome: 'Pedro Souza', email: 'pedro@inpa.gov.br', funcao: 'Técnico', instituicao: 'INPA', status: 'Pendente', projetos: 2 },
    { id: 5, nome: 'Carla Mendes', email: 'carla@ufrj.br', funcao: 'Pós-doc', instituicao: 'UFRJ', status: 'Ativo', projetos: 8 },
  ];

  const filtrados = usuarios.filter(u =>
    u.nome.toLowerCase().includes(busca.toLowerCase()) ||
    u.email.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <PageShell badge={{ number: '13', label: 'Usuários' }}>
      <PageHeader
        overline="pesquisadores"
        title="Usuários"
        onBack={() => navigate('/admin')}
        backLabel="Admin"
        actions={
          <button className="btn-primary">+ Convidar pesquisador</button>
        }
      />

      <div className="mb-5">
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="input-notebook italic font-script text-lg max-w-md"
        />
      </div>

      <div className="card-notebook overflow-hidden p-0">
        <table className="w-full">
          <thead className="bg-sage-100 border-b border-tan">
            <tr>
              <Th>Pesquisador</Th>
              <Th>Email</Th>
              <Th>Instituição</Th>
              <Th>Projetos</Th>
              <Th>Status</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((u) => (
              <tr key={u.id} className="border-b border-dashed border-tan last:border-b-0 hover:bg-paper transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-sage-200 border border-olive/30 flex items-center justify-center text-olive-dark font-semibold text-xs">
                      {getInitials(u.nome)}
                    </div>
                    <span className="font-medium text-olive-dark">{u.nome}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-olive-light/90 text-sm">{u.email}</td>
                <td className="px-6 py-4 text-olive-light/90 text-sm">{u.instituicao}</td>
                <td className="px-6 py-4 heading-serif text-base">{u.projetos}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] tracking-widest font-semibold uppercase rounded-full px-2.5 py-1 border ${
                    u.status === 'Ativo'
                      ? 'border-sage-600 text-sage-600 bg-paper'
                      : 'border-rust text-rust bg-paper'
                  }`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="font-script text-sage-600 text-sm hover:text-olive">
                      editar →
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 mt-2 w-44 bg-paper-light border border-tan rounded-md shadow-notebook z-10 overflow-hidden">
                      <MenuItem label="Editar" />
                      <MenuItem label="Enviar email" />
                      <MenuItem label="Desativar" />
                      <MenuItem label="Excluir" danger />
                    </Menu.Items>
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}

function Th({ children }) {
  return (
    <th className="px-6 py-3 text-left text-[10px] tracking-widest font-semibold uppercase text-olive">
      {children}
    </th>
  );
}

function MenuItem({ label, danger }) {
  return (
    <Menu.Item>
      {({ active }) => (
        <button className={`w-full text-left px-4 py-2 text-sm ${
          danger ? 'text-rust' : 'text-olive-dark'
        } ${active ? 'bg-sage-100' : ''}`}>
          {label}
        </button>
      )}
    </Menu.Item>
  );
}
