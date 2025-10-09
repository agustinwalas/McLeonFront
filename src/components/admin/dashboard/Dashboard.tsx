// src/components/admin/dashboard/Dashboard.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardComponent() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Bienvenido al panel de control
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Aquí irán los componentes del dashboard */}
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              Los datos del dashboard se mostrarán aquí
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
