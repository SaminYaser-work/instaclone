import {
  DocumentData,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import Image from "next/image";
import {
  FormEvent,
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
    seconds: string | number;
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
  const commentInputRef = useRef<HTMLInputElement>(null);

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
    const q2 = query(commentRef, where("postId", "==", id));

    const unsub2 = onSnapshot(q2, (snapshot) => {
      const comms = snapshot.docs.map((doc) => doc.data());
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
        <div>{username}</div>
        <div className="ml-auto text-2xl">
          <BsThreeDots className="cursor-pointer" onClick={todo} />
        </div>
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
            <div className="truncate">{caption}</div>
          </div>
          {comments?.map((comment: any, i: number) => (
            <RenderComments
              username={comment.username}
              comment={comment.comment}
            />
          ))}
        </div>

        <div>
          <p className="text-lg text-gray-400">{createdAt.seconds}</p>
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
          // value={formData.email}
          // onChange={onChangeHandler}
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
    <>
      <div className="text-gray-400 mt-3">Comments</div>
      <div className="flex items-center justify-start gap-3 w-[90%]">
        <div className="font-bold self-start">{username}</div>
        <div className="truncate">{comment}</div>
      </div>
    </>
  );
}
