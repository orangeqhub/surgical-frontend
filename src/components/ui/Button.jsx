import clsx from "clsx";

const variants = {
  primary:
    "bg-text-primary text-white hover:opacity-90 cursor-pointer",

  success:
    "bg-accent text-white hover:opacity-90 cursor-pointer",

  cart:
    "border border-text-primary text-text-primary bg-white hover:bg-primary-soft cursor-pointer",

  call:
    "border border-accent text-accent bg-white hover:bg-green-50 cursor-pointer",
};

const sizes = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}