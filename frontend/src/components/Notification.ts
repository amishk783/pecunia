import toast from "react-hot-toast";

interface Props {
  message: string;
  type: "success" | "error";
}

export const notification = ({ message, type }: Props): void => {
  toast[type](message);
};
