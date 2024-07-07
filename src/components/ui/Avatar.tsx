import { cva, type VariantProps } from "class-variance-authority";

interface AvatarProps extends VariantProps<typeof avatarVariants> {
  src: string;
  className?: string;
  children?: React.ReactNode;
}

const avatarVariants = cva("", {
  variants: {
    variant: {
      default: "",
      rounded: "",
      square: "",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
});

//H

const Avatar: React.FC<AvatarProps> = ({
  src,
  size,
  variant = "square",
  className,
  children,
}) => {
  //FIX
  return (
    <div>
      <img src={src} className=""></img>
    </div>
  );
};

export default Avatar;
