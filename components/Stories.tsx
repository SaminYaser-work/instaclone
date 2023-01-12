import Image from "next/image";

export default function Stories() {
  return (
    <section className="bg-white border border-gray-300 pl-4 shadow-md flex items-center justify-start gap-5 overflow-x-scroll border-t-2 border-t-pink-500 mb-10">
      {new Array(20).fill(0).map((_, i) => (
        <div key={i} className="py-4 border-b border-gray-300 shrink-0">
          <Image
            src={`https://picsum.photos/20?random=${i}.webp`}
            alt="profile"
            className="w-10 h-10 rounded-full ring-[2px] ring-pink-500 ring-offset-2"
            width={100}
            height={100}
          />
        </div>
      ))}
    </section>
  );
}
