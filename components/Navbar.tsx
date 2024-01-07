"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [{ name: "about", href: "/about" }];

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  return (
    <nav className="flex flex-col  items-center px-12 py-12 sm:px-24 md:px-24 lg:px-16">
      <div className="flex flex-col sm:flex-row w-full justify-between ">
        <Link
          href="/"
          className={` ${
            !isHomePage
              ? "hover:decoration-green-500 hover:decoration-wavy hover:underline underline decoration-slice decoration-blue-500"
              : ""
          }`}
        >
          <div className="flex space-x-3">
            <div className="flex flex-col">
              <div className="relative">
                <h1 className="text-3xl tracking-wider">openimage</h1>
                <div className="flex  md:absolute  -top-0 -right-40 space-x-1  font-mono  text-sm ">
                  <h1 className="text-white bg-green-500 px-1">ad-free</h1>
                  <h1 className="text-white bg-blue-500 px-1">no-upload</h1>
                </div>
              </div>
              <h2 className="flex w-full ml-2 text-xs tracking-wider text-gray-500">
                free image compression!
              </h2>
            </div>
          </div>
        </Link>
        <div className="flex items-center">
          <h1 className="text-2xl">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  href={link.href}
                  key={link.name}
                  className={
                    isActive
                      ? "text-gray-500 decoration-3 decoration-wavy decoration-green-500	underline cursor-not-allowed disabled"
                      : "decoration-slice decoration-blue-500	underline hover:decoration-green-500 hover:decoration-wavy hover:underline"
                  }
                >
                  {link.name}
                </Link>
              );
            })}
          </h1>
        </div>
      </div>
    </nav>
  );
}
