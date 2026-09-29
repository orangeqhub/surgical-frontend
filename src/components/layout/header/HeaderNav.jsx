import Container from "../Container";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Orders", href: "/orders" },
];

// Must match the height of the fixed Header above it (e.g. h-16 lg:h-20 = 64px/80px)
const HEADER_HEIGHT = "64px";

export default function HeaderNav() {
  return (
    <div
      className="fixed inset-x-0 z-40 hidden border-t bg-white md:block"
      style={{ top: HEADER_HEIGHT }}
    >
      <Container>
        <nav className="flex h-10 items-center gap-10">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-medium text-gray-700 transition-colors hover:text-blue-600"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </Container>
    </div>
  );
}