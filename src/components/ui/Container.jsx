import clsx from "clsx";

export default function Container({
  children,
  className = "",
}) {
  return (
    <div
      className={clsx(
        "w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16",
        className
      )}
    >
      {children}
    </div>
  );
}