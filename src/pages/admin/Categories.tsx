import { NewCategoryForm } from "@/components/admin/categories/forms/NewCategoryForm";
import { CategoriesTable } from "@/components/admin/categories/table/CategoriesTable";
import { Button } from "@/components/ui/button";
import { useSheetStore } from "@/store/useSheet";
import { Link } from "react-router-dom";

export const Categories = () => {
  const { openSheet, closeSheet } = useSheetStore();

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Categorías</h1>
        <div className="flex gap-2">
          <Button className="btn btn-primary">
            <Link to="/admin/productos">Productos</Link>
          </Button>
          <Button
            className="btn btn-primary"
            onClick={() =>
              openSheet(
                "Agregar categoría",
                "Completá los campos para crear una nueva categoría",
                <NewCategoryForm onSuccess={closeSheet} />
              )
            }
          >
            Agregar
          </Button>
        </div>
      </div>
      <CategoriesTable />
    </>
  );
};
