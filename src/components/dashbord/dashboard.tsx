import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "../ui/card";
import { columns, Payment } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
  ];
}

export async function Dashboard() {
  const data = await getData();

  return (
    <>
      <Card>
        <div className="flex items-center justify-between space-x-2 border-b px-6 pb-6">
          <div>
            <CardTitle>Jobs</CardTitle>
            <CardDescription>
              Manage your jobs and create new ones.
            </CardDescription>
          </div>
          {/* <Button
            variant="outline"
            onClick={() => {
              // Handle create job action here
              console.log("Create Job clicked");
            }}
          >
            <span className="hidden md:inline">Create Job</span>
            <span className="inline md:hidden">New</span>
          </Button> */}
        </div>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
        <CardFooter>
          <div className="text-muted-foreground text-xs">
            Showing <strong>1-10</strong> of <strong>32</strong> products
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
