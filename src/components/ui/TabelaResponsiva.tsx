import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Coluna {
  key: string;
  titulo: string;
  sortable?: boolean;
  render?: (value: any, item: any) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TabelaResponsivaProps {
  dados?: any[];
  colunas?: Coluna[];
  headers?: string[]; // Compatibilidade com formato antigo
  rows?: any[][]; // Compatibilidade com formato antigo
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: any) => void;
  className?: string;
}

function TabelaResponsiva({
  dados,
  colunas,
  headers,
  rows,
  onSort,
  sortKey,
  sortDirection,
  loading = false,
  emptyMessage = 'Nenhum registro encontrado',
  onRowClick,
  className = ''
}: TabelaResponsivaProps) {
  
  // Compatibilidade: converter formato antigo para o novo
  let finalDados = dados || [];
  let finalColunas = colunas || [];
  
  if (headers && rows) {
    finalColunas = headers.map((header, index) => ({
      key: index.toString(),
      titulo: header,
      render: (_value: any, item: any) => rows[finalDados.indexOf(item)][index]
    }));
    finalDados = rows.map((row, index) => ({ _index: index, ...row }));
  }
  
  const handleSort = (key: string) => {
    if (!onSort) return;
    
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(key, newDirection);
  };

  const renderSortIcon = (key: string) => {
    if (sortKey !== key) return null;
    
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const getAlignClass = (align?: string) => {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {/* Versão Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {finalColunas.map((coluna) => (
                <th
                  key={coluna.key}
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${getAlignClass(coluna.align)} ${
                    coluna.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  style={{ width: coluna.width }}
                  onClick={() => coluna.sortable && handleSort(coluna.key)}
                >
                  <div className="flex items-center gap-1">
                    <span>{coluna.titulo}</span>
                    {coluna.sortable && renderSortIcon(coluna.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {finalDados.length === 0 ? (
              <tr>
                <td colSpan={finalColunas.length} className="px-6 py-12 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              finalDados.map((item, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {finalColunas.map((coluna) => (
                    <td
                      key={coluna.key}
                      className={`px-6 py-4 whitespace-nowrap text-sm ${getAlignClass(coluna.align)}`}
                    >
                      {coluna.render 
                        ? coluna.render(item[coluna.key], item)
                        : item[coluna.key]
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Versão Mobile - Cards */}
      <div className="md:hidden">
        {dados && dados.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {dados && dados.map((item, index) => (
              <div
                key={index}
                className={`p-4 ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {colunas && colunas.map((coluna) => (
                  <div key={coluna.key} className="flex justify-between items-center py-1">
                    <span className="text-sm font-medium text-gray-700">
                      {coluna.titulo}:
                    </span>
                    <span className="text-sm text-gray-900">
                      {coluna.render 
                        ? coluna.render(item[coluna.key], item)
                        : item[coluna.key]
                      }
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TabelaResponsiva; 