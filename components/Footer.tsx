import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

export default function Footer() {
  return (
    <footer className="flex items-center justify-center border-t p-4  bg-gray-100 font-mono text-gray-500 mt-16">
      <div className="flex items-center space-x-2">
        <Avatar>
          <AvatarImage
            src="https://avatars.githubusercontent.com/u/41871666?v=4&height=12&width=12"
            alt="@dogcodes"
            className="object-contain"
          />
          <AvatarFallback>DC</AvatarFallback>
        </Avatar>
        <span className="tracking-tight">
          made by{" "}
          <Link
            href="https://ko-fi.com/dogcodes"
            className="font-bold hover:underline hover:underline-offset-2 hover:bg-yellow-200 bg-yellow-300 px-1 text-black"
          >
            @dogcodes
          </Link>{" "}
        </span>
      </div>
    </footer>
  );
}
