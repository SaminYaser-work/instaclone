import {
  DocumentData,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import Image from "next/image";
import {
  FormEvent,
  Fragment,
  MouseEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { BsThreeDots, BsEmojiSmile } from "react-icons/bs";
import { FaRegComment, FaRegPaperPlane } from "react-icons/fa";
import { TbFlag3 } from "react-icons/tb";
import { auth, db } from "../lib/firebase";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { GlobalContext } from "../state/context/GlobalContextProvider";
import { toast } from "react-hot-toast";
import { Menu, Transition } from "@headlessui/react";

export default function Posts() {
  const [posts, setPosts] = useState<DocumentData[]>();

  useEffect(() => {
    const postCollection = collection(db, "posts");
    const q = query(postCollection, orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map((doc) => doc.data());
      setPosts(posts);
    });
  }, []);

  // const handleLike = () => {
  //   const postLike = {
  //     postId: 123,
  //     userId: auth.currentUser?.uid,
  //     username: user.user.username,
  //   };

  //   const likeRef = doc(db, `likes/${postID}_${auth.currentUser?.uid}`);
  // };

  console.log(posts);

  return (
    <section>
      {posts &&
        posts.map((post, i) => (
          <RenderPost
            username={post.username}
            image={post.image}
            caption={post.caption}
            key={i}
            createdAt={post.createdAt}
            id={post.id}
          />
        ))}
    </section>
  );
}

type Post = {
  username: string;
  image: string;
  caption: string;
  id: string;
  key: number;
  createdAt: {
    seconds: number;
  };
};

type Comment = {
  username: any;
  comment: any;
};

function RenderPost({ username, image, caption, key, createdAt, id }: Post) {
  const todo = () => {
    alert("This feature has not been implemented you");
  };

  const [isLiked, setIsLiked] = useState(false);
  const [numLikes, setNumLikes] = useState(0);
  const [comments, setComments] = useState<any>();
  const [isEditing, setIsEditing] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const captionEditRef = useRef<HTMLInputElement>(null);

  const { user } = useContext(GlobalContext);

  useEffect(() => {
    const likeRef = collection(db, `likes`);
    const q = query(likeRef, where("postId", "==", id));

    const unsub = onSnapshot(q, (snapshot) => {
      const likes = snapshot.docs.map((doc) => doc.data());
      console.log("Like data: ", likes);
      setNumLikes(likes.length);
      for (let i = 0; i < likes.length; i++) {
        if (likes[i].userId === auth.currentUser?.uid) {
          setIsLiked(true);
        }
      }
    });

    const commentRef = collection(db, `comments`);
    const q2 = query(
      commentRef,
      where("postId", "==", id),
      orderBy("createdAt")
    );

    const unsub2 = onSnapshot(q2, (snapshot) => {
      let comms = snapshot.docs.map((doc) => doc.data());

      setComments(comms);
      console.log("Comment data: ", comms);
    });

    return () => {
      unsub();
      unsub2();
    };
  }, []);

  const handleLike = async () => {
    if (isLiked) return;

    const postLike = {
      postId: id,
      userId: auth.currentUser?.uid,
      username: user.user.username,
    };

    const likeRef = doc(db, `likes/${id}_${auth.currentUser?.uid}`);
    try {
      await setDoc(likeRef, postLike);
      setIsLiked(true);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Unable to like the post.");
    }
  };

  const isValidComment = (e: FormEvent<HTMLFormElement>) => {
    if (commentInputRef.current === null) return false;
    if (commentInputRef.current.value === "") return false;
    return true;
  };

  const handleComment = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Commenting");

    if (!isValidComment) {
      toast.error("Comment cannot be empty");
      return;
    }

    const comment = {
      postId: id,
      userId: auth.currentUser?.uid,
      username: user.user.username,
      comment: commentInputRef.current?.value,
      createdAt: serverTimestamp(),
    };

    const commentRef = doc(
      db,
      `comments/${id}_${auth.currentUser?.uid}_${Date.now()}`
    );
    try {
      await setDoc(commentRef, comment);
      commentInputRef.current!.value = "";
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Unable to like the post.");
    }
  };

  const handleDelete = async () => {
    const postRef = doc(db, `posts/${id}`);
    try {
      await deleteDoc(postRef);
      location.reload();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Unable to delete the post.");
    }
  };

  const updateCaption = async () => {
    const postRef = doc(db, `posts/${id}`);
    try {
      await updateDoc(postRef, {
        caption: captionEditRef.current!.value,
      });
      setIsEditing(false);
      toast.success("Post edited successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Unable to edit the post.");
    }
  };

  return (
    <div
      key={key}
      className="flex flex-col w-full bg-[#FAFAFA] rounded-lg shadow-md mb-10 border border-gray-300"
    >
      <div className="flex items-center justify-start px-4 py-4 gap-3">
        <div className="w-10 h-10 ring-[2xp] ring-pink-500 ring-offset-2 rounded-full">
          <Image
            src="https://picsum.photos/seed/picsum/30"
            alt="profile"
            className="w-10 h-10 rounded-full ring-[2px] ring-pink-500 ring-offset-2"
            width={100}
            height={100}
          />
        </div>
        <div className="flex flex-col justify-center items-start">
          <p className="text-xl">{username}</p>
          {/* <p className="text-md text-gray-400">
            {Math.floor(
              new Date().getTime() -
                new Date(createdAt.seconds * 1000).getTime()
            )}
          </p> */}
        </div>

        {user.user.username === username && (
          <div className="ml-auto cursor-pointer">
            <DropDownMenu
              handleDelete={handleDelete}
              handleEdit={() => setIsEditing(true)}
            />
          </div>
        )}
      </div>

      <div className="w-full">
        <Image
          src={image}
          alt={caption}
          className="w-full max-h-[40rem] object-cover"
          width={700}
          height={500}
        />
      </div>

      <div className="p-4 space-y-3 text-xl">
        <div className="flex items-center justify-start text-2xl gap-4">
          <div onClick={handleLike}>
            {isLiked ? (
              <AiFillHeart className="cursor-pointer text-red-500 text-3xl" />
            ) : (
              <AiOutlineHeart className="cursor-pointer text-3xl" />
            )}
          </div>

          <FaRegComment onClick={todo} className="cursor-pointer" />
          <FaRegPaperPlane onClick={todo} className="cursor-pointer" />
          <TbFlag3 onClick={todo} className="ml-auto text-3xl cursor-pointer" />
        </div>

        {(isLiked && (
          <p>
            Liked by <span className="font-bold">you </span>
            {numLikes > 1 && (
              <span>
                {" "}
                and {numLikes - 1} {numLikes > 2 ? "others" : "other"}
              </span>
            )}
          </p>
        )) ||
          (numLikes > 0 && (
            <p>
              Liked by <span className="font-bold">{numLikes} people</span>
            </p>
          ))}

        <div className="">
          <div className="flex items-center justify-start gap-3 w-[90%]">
            <div className="font-bold self-start">{username}</div>
            <div className="flex justify-center items-center gap-5">
              <label htmlFor="caption" hidden>
                caption
              </label>
              <input
                ref={captionEditRef}
                type="text"
                name="caption"
                id="caption"
                className="bg-transparent focus:outline-none placeholder-black border border-gray-400 disabled:border-transparent rounded-md px-1"
                disabled={!isEditing}
                placeholder={caption}
              />
              {isEditing && (
                <div>
                  <button
                    className={`text-blue-400 font-bold mr-3`}
                    onClick={updateCaption}
                  >
                    Done
                  </button>
                  <button
                    className={`text-red-400 font-bold`}
                    onClick={() => {
                      setIsEditing(false);
                      captionEditRef.current!.value = "";
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="text-gray-400 mt-3">Comments</div>
          {comments?.map((comment: any, i: number) => (
            <RenderComments
              username={comment.username}
              comment={comment.comment}
            />
          ))}
        </div>
      </div>

      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          console.log("submit comment " + key);
        }}
        className="flex items-center justify-start bg-slate-50 focus-within:bg-white border border-gray-300 py-4 px-3 border-x-0 gap-5"
      >
        <BsEmojiSmile className="text-2xl" />
        <input
          type="text"
          ref={commentInputRef}
          name="comment"
          placeholder="Add a comment"
          className=" outline-none bg-transparent text-xl flex-1"
        />
        <button
          type="submit"
          onClick={handleComment}
          className="font-semibold text-blue-500 text-xl cursor-pointer"
        >
          Post
        </button>
      </form>
    </div>
  );
}

function RenderComments({ username, comment }: Comment) {
  return (
    <div className="flex items-center justify-start gap-3 w-[90%]">
      <div className="font-bold self-start">{username}</div>
      <div className="truncate">{comment}</div>
    </div>
  );
}

function DropDownMenu({
  handleEdit,
  handleDelete,
}: {
  handleEdit: () => void;
  handleDelete: () => void;
}) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="">
          <BsThreeDots className="text-2xl text-black" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleEdit}
                className={`${
                  active ? "bg-violet-500 text-white" : "text-gray-900"
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
              >
                {active ? (
                  <EditActiveIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                ) : (
                  <EditInactiveIcon
                    className="mr-2 h-5 w-5"
                    aria-hidden="true"
                  />
                )}
                Edit
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleDelete}
                className={`${
                  active ? "bg-blue-500 text-white" : "text-gray-900"
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
              >
                {active ? (
                  <DeleteActiveIcon
                    className="mr-2 h-5 w-5 text-blue-400"
                    aria-hidden="true"
                  />
                ) : (
                  <DeleteInactiveIcon
                    className="mr-2 h-5 w-5 text-blue-400"
                    aria-hidden="true"
                  />
                )}
                Delete
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

function EditInactiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
    </svg>
  );
}

function EditActiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
    </svg>
  );
}

function DuplicateInactiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4H12V12H4V4Z"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
      <path
        d="M8 8H16V16H8V8Z"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
    </svg>
  );
}

function DuplicateActiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4H12V12H4V4Z"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
      <path
        d="M8 8H16V16H8V8Z"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
    </svg>
  );
}

function ArchiveInactiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="8"
        width="10"
        height="8"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
      <rect
        x="4"
        y="4"
        width="12"
        height="4"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
      <path d="M8 12H12" stroke="#A78BFA" strokeWidth="2" />
    </svg>
  );
}

function ArchiveActiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="8"
        width="10"
        height="8"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
      <rect
        x="4"
        y="4"
        width="12"
        height="4"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
      <path d="M8 12H12" stroke="#A78BFA" strokeWidth="2" />
    </svg>
  );
}

function MoveInactiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 4H16V10" stroke="#A78BFA" strokeWidth="2" />
      <path d="M16 4L8 12" stroke="#A78BFA" strokeWidth="2" />
      <path d="M8 6H4V16H14V12" stroke="#A78BFA" strokeWidth="2" />
    </svg>
  );
}

function MoveActiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 4H16V10" stroke="#C4B5FD" strokeWidth="2" />
      <path d="M16 4L8 12" stroke="#C4B5FD" strokeWidth="2" />
      <path d="M8 6H4V16H14V12" stroke="#C4B5FD" strokeWidth="2" />
    </svg>
  );
}

function DeleteInactiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="6"
        width="10"
        height="10"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
      <path d="M3 6H17" stroke="#A78BFA" strokeWidth="2" />
      <path d="M8 6V4H12V6" stroke="#A78BFA" strokeWidth="2" />
    </svg>
  );
}

function DeleteActiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="6"
        width="10"
        height="10"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
      <path d="M3 6H17" stroke="#C4B5FD" strokeWidth="2" />
      <path d="M8 6V4H12V6" stroke="#C4B5FD" strokeWidth="2" />
    </svg>
  );
}
