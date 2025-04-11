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
        {/* <CardFooter>
          <div className="text-muted-foreground text-xs">
            Showing <strong>1-10</strong> of <strong>32</strong> products
          </div>
        </CardFooter> */}
      </Card>
    </>
  );
}
