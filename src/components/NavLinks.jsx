import Link from "next/link";
import React from "react";

const LINKS = [
  { href: "/chat", label: "Chat" },
  { href: "/tours", label: "Tours" },
  { href: "/tours/new-tour", label: "New Tour" },
  { href: "/profile", label: "Profile" },
];

const NavLinks = () => {
  return (
    <ul className="menu text-base-content">
      {LINKS.map((link) => (
        <li>
          <Link className="capitalize" key={link.href} href={link.href}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavLinks;
