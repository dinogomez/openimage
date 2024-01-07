import Image from "next/image";
import Link from "next/link";
import { Github, Coffee } from "lucide-react";

export default function AboutCard() {
  return (
    <section className="flex justify-center items-center font-mono ">
      <div className="w-full max-w-md p-6 m-4 bg-white shadow-md rounded-lg">
        <div className="flex justify-center md:justify-end -mt-16">
          <Image
            alt="Website maker in action"
            className="object-cover w-20 h-20 rounded-full "
            height={100}
            src="/dog.png"
            style={{
              aspectRatio: "100/100",
              objectFit: "cover",
            }}
            width={100}
          />
        </div>
        <div className="mt-2">
          <h2 className="text-3xl font-semibold text-gray-800 tracking-wide decoration-slice underline underline-offset-4 decoration-green-500">
            @dogcodes
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Hi! I'm a full-stack developer with a passion for creating
            open-source tools, extensions, and websites—
            <span className="bg-yellow-300 inline-block text-gray-700 ">
              all free of ads
            </span>
            . You can explore my work on GitHub. If you find my works and
            projects valuable, consider supporting me through Ko-fi. Let's build
            a better digital world together! 🐶🚀
          </p>
        </div>
        <div className="mt-4 flex text-sm justify-end">
          <Link
            className="mx-2 bg-black text-white px-1 hover:underline "
            href="https://github.com/dinogomez"
          >
            <h1>github</h1>
          </Link>
          <Link
            className="mx-2 bg-rose-500 text-white px-1 hover:underline"
            href="https://ko-fi.com/dogcodes"
          >
            <h1>kofi</h1>
          </Link>
        </div>
      </div>
    </section>
  );
}
