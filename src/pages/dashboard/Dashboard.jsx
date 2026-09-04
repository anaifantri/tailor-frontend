import { useAuth } from "@/context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <div className="flex w-full justify-center items-center p-2">
        <label>Welcome {user.name}</label>
      </div>
    </>
  );
}

export default Dashboard;
