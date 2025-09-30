import { ColumnDef } from "@tanstack/react-table";
import { ShopifySale } from "@/store/useShopifySales";

export function useShopifySalesColumns(): ColumnDef<ShopifySale>[] {
	return [
		{
			accessorKey: "name",
			header: "N° Orden",
			cell: info => info.getValue(),
		},
		{
			accessorKey: "created_at",
			header: "Fecha",
			cell: info => new Date(info.getValue() as string).toLocaleString(),
		},
		{
			accessorKey: "customer",
			header: "Cliente",
			cell: info => {
				const customer = info.row.original.customer;
				if (!customer) return "-";
				return `${customer.first_name || ""} ${customer.last_name || ""}`.trim();
			},
		},
		{
			accessorKey: "total_price",
			header: "Total",
			cell: info => `$${info.getValue()}`,
		},
		{
			accessorKey: "currency",
			header: "Moneda",
			cell: info => info.getValue(),
		},
	];
}
