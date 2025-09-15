import { useState } from "react";
import { Menu } from "@headlessui/react";

export default function UserManagement() {
  // Mock de dados (futuramente pode vir do backend)
  const usuarios = [
    {
      id: 1,
      nome: "Prof. João Santos",
      email: "joao.santos@instituto.gov.br",
      funcao: "Professor",
      instituicao: "Instituto de Pesquisas",
      status: "Ativo",
      projetos: 2,
      coletas: 8,
      ultimoAcesso: "20/01/2024",
    },
    {
      id: 2,
      nome: "Ana Costa",
      email: "ana.costa@estudante.edu.br",
      funcao: "Estudante",
      instituicao: "Universidade Estadual",
      status: "Ativo",
      projetos: 1,
      coletas: 5,
      ultimoAcesso: "21/01/2024",
    },
    {
      id: 3,
      nome: "Carlos Oliveira",
      email: "carlos.oliveira@lab.com",
      funcao: "Técnico",
      instituicao: "Laboratório de Análises",
      status: "Inativo",
      projetos: 0,
      coletas: 0,
      ultimoAcesso: "17/01/2024",
    },
    {
      id: 4,
      nome: "Dra. Fernanda Lima",
      email: "fernanda.lima@pesquisa.org",
      funcao: "Administrador",
      instituicao: "Centro de Pesquisas",
      status: "Ativo",
      projetos: 5,
      coletas: 25,
      ultimoAcesso: "21/01/2024",
    },
  ];

  return (
    <div className="p-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gerenciar Usuários</h1>
          <p className="text-gray-500 text-sm">
            Administre contas de usuário e permissões
          </p>
        </div>
        <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
          + Novo Usuário
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border rounded-lg p-6 shadow-sm text-center">
          <h3 className="text-2xl font-bold text-gray-800">5</h3>
          <p className="text-sm text-gray-600">Total de Usuários</p>
        </div>
        <div className="bg-white border rounded-lg p-6 shadow-sm text-center">
          <h3 className="text-2xl font-bold text-gray-800">4</h3>
          <p className="text-sm text-gray-600">Usuários Ativos</p>
        </div>
        <div className="bg-white border rounded-lg p-6 shadow-sm text-center">
          <h3 className="text-2xl font-bold text-gray-800">11</h3>
          <p className="text-sm text-gray-600">Projetos Criados</p>
        </div>
        <div className="bg-white border rounded-lg p-6 shadow-sm text-center">
          <h3 className="text-2xl font-bold text-gray-800">53</h3>
          <p className="text-sm text-gray-600">Coletas Realizadas</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white border rounded-lg p-6 shadow-sm mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Buscar por nome, email..."
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Todos os Status</option>
            <option>Ativo</option>
            <option>Inativo</option>
          </select>
          <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Todas as Funções</option>
            <option>Administrador</option>
            <option>Professor</option>
            <option>Estudante</option>
            <option>Técnico</option>
          </select>
        </div>
      </div>

      {/* Lista de Usuários */}
      <div className="bg-white border rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">
            Usuários ({usuarios.length})
          </h3>
          <p className="text-sm text-gray-500">
            Lista de todos os usuários cadastrados no sistema
          </p>
        </div>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nome
              </th>
              <th className="px-6 py-3">Função</th>
              <th className="px-6 py-3">Instituição</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Projetos</th>
              <th className="px-6 py-3">Último Acesso</th>
              <th className="px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-800">{u.nome}</div>
                  <div className="text-gray-500">{u.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                    {u.funcao}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700">{u.instituicao}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      u.status === "Ativo"
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {u.projetos} projetos
                  <br />
                  {u.coletas} coletas
                </td>
                <td className="px-6 py-4 text-gray-700">{u.ultimoAcesso}</td>
                <td className="px-6 py-4 text-right">
                  {/* Menu de ações */}
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="px-2 py-1 rounded hover:bg-gray-100">
                      ⋮
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`w-full text-left px-4 py-2 text-sm ${
                              active ? "bg-gray-100" : ""
                            }`}
                          >
                            ✏️ Editar
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`w-full text-left px-4 py-2 text-sm ${
                              active ? "bg-gray-100" : ""
                            }`}
                          >
                            📧 Enviar Email
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`w-full text-left px-4 py-2 text-sm ${
                              active ? "bg-gray-100" : ""
                            }`}
                          >
                            🚫 Desativar
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`w-full text-left px-4 py-2 text-sm text-red-600 ${
                              active ? "bg-red-50" : ""
                            }`}
                          >
                            🗑️ Excluir
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
