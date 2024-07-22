
import Weather from "@/components/widgets/weather/wheather";
import { useAuth } from "@/lib/providers/AuthProvider";
const Dashboard = () => {
  const { user } = useAuth();
  console.log(user);
  return (
    <div className="m-10">
      <Weather />
      <p></p>
    </div>
  );
};

export default Dashboard;
