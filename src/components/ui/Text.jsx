import clsx from "clsx";

const variants = {
  display: "text-3xl md:text-5xl lg:text-6xl font-bold leading-tight",

  h1: "text-3xl md:text-4xl lg:text-5xl font-bold leading-tight",

  h2: "text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight",

  h3: "text-xl md:text-2xl lg:text-3xl font-semibold leading-snug",

  h4: "text-lg md:text-xl lg:text-2xl font-semibold leading-snug",

  h5: "text-base md:text-lg lg:text-xl font-semibold",

  h6: "text-sm md:text-base lg:text-lg font-semibold",

  body: "text-sm md:text-base leading-7 text-gray-700",

  bodySmall: "text-xs md:text-sm leading-6 text-gray-600",

  caption: "text-xs text-gray-500",

  label: "text-sm font-medium text-gray-800",
};

export default function Text({
  as: Component = "p",
  variant = "body",
  className = "",
  children,
  ...props
}) {
  return (
    <Component
      className={clsx(
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}