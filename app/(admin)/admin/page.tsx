import { Dashboard } from "@/components/DashBoard/Dashboard";
import { getDashboardData } from "@/actions/getDashboardData";

const page = async () => {
  const { data: dashboardData, success } = await getDashboardData();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <Dashboard initialData={dashboardData!} success={success} />
    </div>
  );
};

export default page;
