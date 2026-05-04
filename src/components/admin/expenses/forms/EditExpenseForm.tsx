import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useExpenseStore } from "@/store/useExpense";
import { IExpense } from "@/types/expense";

const schema = z.object({
  title: z.string().min(1, "El título es requerido").max(200),
  date: z.string().min(1, "La fecha es requerida"),
  amount: z
    .string()
    .min(1, "El gasto es requerido")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, {
      message: "Ingresá un monto válido",
    }),
});

type FormData = z.infer<typeof schema>;

interface Props {
  expense: IExpense;
  onSuccess?: () => void;
}

export const EditExpenseForm = ({ expense, onSuccess }: Props) => {
  const { updateExpense, loading } = useExpenseStore();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: expense.title,
      date: new Date(expense.date).toISOString().split("T")[0],
      amount: expense.amount.toString(),
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await updateExpense(expense._id, {
        title: data.title,
        date: data.date,
        amount: parseFloat(data.amount),
      });
      onSuccess?.();
    } catch {}
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Alquiler del local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gasto</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Actualizando..." : "Actualizar gasto"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
