import Image from "next/image";
import Link from "next/link";
import { Github, Coffee } from "lucide-react";

const credits = [
  { name: "@nextjs", href: "https://nextjs.org/" },
  { name: "@shadcn/ui", href: "https://ui.shadcn.com/" },
  {
    name: "@react-dropzone",
    href: "https://www.npmjs.com/package/react-dropzone",
  },
  {
    name: "@HamedBahram/next-upload",
    href: "https://github.com/HamedBahram/next-upload",
  },
  {
    name: "@fengyuanchen/compressorjs",
    href: "https://github.com/fengyuanchen/compressorjs",
  },
];

export default function CostCard() {
  return (
    <section className="flex justify-center items-center font-mono ">
      <div className="w-full max-w-md p-6 m-4 bg-white shadow-md rounded-lg">
        <div className="mt-2">
          <h2 className="text-3xl font-semibold text-gray-800 tracking-wide decoration-slice underline underline-offset-4 decoration-green-500">
            @transparency
          </h2>
          <div className="mt-2">
            <p className="text-gray-600 border-b mb-2">~ made with</p>
            <p className="text-sm text-gray-500">
              {credits.map((link) => {
                return (
                  <Link
                    href=""
                    className="hover:underline hover:underline-offset-4 hover:decoration-wavy hover:bg-black hover:text-white"
                  >
                    {link.name},{" "}
                  </Link>
                );
              })}
            </p>
          </div>
          <div className="mt-2">
            <p className="text-gray-600 border-b mb-2">operating cost</p>
            <div className="text-sm text-gray-500">
              {" "}
              <p>domain : 23$</p>
              <p>server : TBD$</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
