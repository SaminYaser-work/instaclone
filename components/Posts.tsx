import Image from "next/image";
import { FormEvent } from "react";
import { BsThreeDots, BsHeart, BsEmojiSmile } from "react-icons/bs";
import { FaRegComment, FaRegPaperPlane } from "react-icons/fa";
import { TbFlag3 } from "react-icons/tb";

export default function Posts() {
  return (
    <section>
      {new Array(10).fill(0).map((_, i) => (
        <div
          key={i}
          className="flex flex-col w-full bg-[#FAFAFA] rounded-lg shadow-md mb-10 border border-gray-300"
        >
          <div className="flex items-center justify-start px-4 py-4 gap-3">
            <div className="w-10 h-10 ring-[2xp] ring-pink-500 ring-offset-2 rounded-full">
              <Image
                src="https://picsum.photos/100"
                alt="profile"
                className="w-10 h-10 rounded-full ring-[2px] ring-pink-500 ring-offset-2"
                width={100}
                height={100}
              />
            </div>
            <div>Username</div>
            <div className="ml-auto text-2xl">
              <BsThreeDots />
            </div>
          </div>

          <div className="w-full">
            <Image
              src={"https://picsum.photos/700/500"}
              alt={"photo"}
              className="w-full max-h-[40rem] object-cover"
              width={700}
              height={500}
            />
          </div>

          <div className="p-4 space-y-3 text-xl">
            <div className="flex items-center justify-start text-2xl gap-4">
              <BsHeart />
              <FaRegComment />
              <FaRegPaperPlane />
              <TbFlag3 className="ml-auto text-3xl" />
            </div>
            <div>
              Like by <span className="font-semibold">username</span> and{" "}
              <span className="font-semibold">username</span>
            </div>

            <div className="">
              {new Array(3).fill(0).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-start gap-3 w-[90%]"
                >
                  <div className="font-bold self-start">Username</div>
                  <div className="truncate">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Nulla quidem architecto necessitatibus et, nesciunt aliquid
                    iste porro vero eligendi, perspiciatis libero. At facere
                    obcaecati est eius ut expedita! Fugiat non dicta provident
                    tempora odio rerum sint voluptatem maiores. Ea fugiat
                    explicabo fugit temporibus sapiente voluptatum vitae quos
                    inventore minima laboriosam?
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p className="text-lg text-gray-400">3 Days ago</p>
            </div>
          </div>

          <form
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              console.log("submit comment " + i);
            }}
            className="flex items-center justify-start bg-slate-50 focus-within:bg-white border border-gray-300 py-4 px-3 border-x-0 gap-5"
          >
            <BsEmojiSmile className="text-2xl" />
            <input
              type="text"
              name="comment"
              placeholder="Add a comment"
              // value={formData.email}
              // onChange={onChangeHandler}
              className=" outline-none bg-transparent text-xl flex-1"
            />
            <button
              type="submit"
              className="font-semibold text-blue-500 text-xl cursor-pointer"
            >
              Post
            </button>
          </form>
        </div>
      ))}
    </section>
  );
}
