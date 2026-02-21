import { useQuery } from "@tanstack/react-query";
import axios from "../api/axios";

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await axios.get("/org/dashboard");
      return res.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Total Members: {data.totalMembers}</p>
      <p>Admins: {data.admins}</p>
    </div>
  );
}