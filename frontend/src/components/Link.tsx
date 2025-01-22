import { useAuth } from "@/lib/stores/AuthProvider";
import { useBudget } from "@/lib/stores/BudgetProvider";
import { format } from "date-fns";
import { useCallback } from "react";
import { Link as RouterLink, LinkProps } from "react-router-dom"; // Import directly from react-router-dom
import { notification } from "./Notification";
import api from "@/services/api";
import { date } from "zod";
import { useExpense } from "@/lib/stores/ExpenseProvier";
import { getAllTransaction } from "@/services/transaction";

// Define the type for the custom Link component props
interface CustomLinkProps extends LinkProps {
  to: string; // Ensure 'to' is always a string
  onMouseEnter?: (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => void;
}

const Link: React.FC<CustomLinkProps> = ({ to, onMouseEnter, ...props }) => {
  const { isAuth } = useAuth();
  const { setBudget, fetchBudget } = useBudget(); // Assuming `budget` exists
  const { setExpenses } = useExpense();

  const handleMouseEnter = useCallback(
    async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      // Call any existing onMouseEnter prop if provided
      if (onMouseEnter) onMouseEnter(event);
      const currentDate = new Date();
      const date = format(currentDate, "dd/MM/yyyy");

      console.log(to === "/app/budget");
      // Prefetch budget data only if the target route is '/expenses'
      if (to === "/app/budget" && isAuth) {
        console.log("asdjsad");
        fetchBudget(date);
      } else if (to === "/app/expenses" && isAuth) {
        try {
          const res = await getAllTransaction();

          setExpenses(res);
        } catch (error) {
          notification({
            type: "error",
            message: "Failed to fetch transactions. Please try again.",
          });
        }
      }
    },
    [to, isAuth, fetchBudget, onMouseEnter, setExpenses]
  );

  return <RouterLink to={to} onMouseEnter={handleMouseEnter} {...props} />;
};

export default Link;
