import { api } from "@/trpc/server";

import { Card, CardContent } from "../ui/card";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Header } from "./header";

export async function Dashboard() {
  const jobs = await api.requisition.all();

  return (
    <>
      <Card>
        <Header />
        <CardContent>
          <DataTable columns={columns} data={jobs} />
        </CardContent>
      </Card>
    </>
  );
}
