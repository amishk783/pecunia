import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6, { message: "Should be greater than 6 letters" }),
});

type FormData = z.infer<typeof schema>;

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="email" {...register("email")} />
        {errors.email?.message && <p>{errors.email?.message}</p>}
        <input type="password" {...register("password")} />
        {errors.email?.message && <p>{errors.email?.message}</p>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
