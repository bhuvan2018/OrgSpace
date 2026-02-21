import { useQuery } from "@tanstack/react-query";
import "../styles/dashboard.css";
import Layout from "../components/Layout";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await axios.get("/org/dashboard");
      return res.data;
    },
  });

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (isLoading) return <p>Loading dashboard...</p>;

  return (
    <Layout>
      <h2>Dashboard</h2>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-title">Total Members</div>
          <div className="card-value">{data.totalMembers}</div>
        </div>

        <div className="card">
          <div className="card-title">Admins</div>
          <div className="card-value">{data.admins}</div>
        </div>
      </div>

      <button onClick={() => navigate("/members")}>View Members</button>
      <button onClick={logout}>Logout</button>
    </Layout>
  );
}