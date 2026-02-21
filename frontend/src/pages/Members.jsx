import { useQuery } from "@tanstack/react-query";
import axios from "../api/axios";

export default function Members() {
  const { data, isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const res = await axios.get("/org/members?page=1&limit=5");
      return res.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Members</h2>
      {data.members.map((m) => (
        <div key={m._id}>
          {m.userId.name} — {m.userId.email} — {m.role}
        </div>
      ))}
    </div>
  );
}