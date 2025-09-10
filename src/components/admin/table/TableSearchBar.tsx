import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface TableSearchBarProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

const TableSearchBar: React.FC<TableSearchBarProps> = ({ globalFilter, setGlobalFilter }) => {
  return (
    <div className="relative w-full">
      <Input
        className="peer pe-9 ps-9"
        placeholder="Buscar..."
        type="search"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />
      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
        <Search size={16} strokeWidth={2} />
      </div>
    </div>
  );
};

export default TableSearchBar;
