import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../api/axios";
import { useState } from "react";
import Layout from "../components/Layout";
import "../styles/members.css";

export default function Members() {
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [page, setPage] = useState(1);

  const limit = 5;

  const { data, isLoading } = useQuery({
    queryKey: ["members", page],
    queryFn: async () => {
      const res = await axios.get(
        `/org/members?page=${page}&limit=${limit}`
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const invite = async () => {
    if (!email) return;

    try {
      await axios.post("/org/invite", { email });
      setEmail("");
      queryClient.invalidateQueries(["members"]);
      alert("User invited");
    } catch (err) {
      alert(err.response?.data?.message || "Invite failed");
    }
  };

  if (isLoading) return <p className="page-container">Loading...</p>;

  return (
    <Layout>
      <h2>Members</h2>

      <div className="invite-box">
        <input
          placeholder="Invite user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={invite}>Invite</button>
      </div>

      <div className="member-list">
        {data.members.map((m) => (
          <div key={m._id} className="member-item">
            <div>
              <b>{m.userId.name}</b>
              <div>{m.userId.email}</div>
            </div>
            <span>{m.role}</span>
          </div>
        ))}
      </div>
      
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Prev
        </button>

        <span>
          Page {data.page} of {data.totalPages}
        </span>

        <button
          disabled={page === data.totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </Layout>
  );
}