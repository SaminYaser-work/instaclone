import Modal from "../components/Modal";
import {
  ChangeEvent,
  MouseEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  GlobalContext,
  GlobalDispatch,
} from "../state/context/GlobalContextProvider";
import { ActionTypesEnum } from "../types/GRTypes";
import { Dialog } from "@headlessui/react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { SlPicture } from "react-icons/sl";
import { auth, db, storage } from "../lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

export default function UploadModal() {
  const dispatch = useContext(GlobalDispatch);
  const { isUploadModalOpen, user } = useContext(GlobalContext);

  const handleModalClose = () => {
    dispatch({
      type: ActionTypesEnum.SET_IS_UPLOAD_MODAL_OPEN,
      payload: {
        isUploadModalOpen: false,
      },
    });
  };

  const [file, setFile] = useState<FileList>();
  const [preview, setPreview] = useState("");
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  console.log(file);

  useEffect(() => {
    const reader = new FileReader();

    const handleEvent = (e: any) => {
      switch (e.type) {
        case "load":
          const res = reader.result;
          if (typeof res == "string") {
            setPreview(res);
          }
          break;
        case "error":
          toast.error("Unable to upload file!");
          break;
        default:
          toast.error("Unkown case: " + e.type);
      }
    };

    if (file) {
      reader.addEventListener("load", handleEvent);
      reader.addEventListener("error", handleEvent);
      reader.readAsDataURL(file[0]);
    }

    return () => {
      reader.removeEventListener("load", handleEvent);
      reader.removeEventListener("error", handleEvent);
    };
  }, [file]);

  const handleUpload = async () => {
    if (file) {
      console.log("uploading file");
      setIsUploading(true);
      const toastId = toast.loading("Uploading...");
      const storageRef = ref(
        storage,
        "posts/" + Date.now() + "-" + file[0].name
      );

      try {
        const uploadTask = await uploadBytes(storageRef, file[0]);
        const url = await getDownloadURL(uploadTask.ref);

        const postid = crypto.randomUUID();
        const postRef = doc(db, "posts", postid);
        const post = {
          id: postid,
          image: url,
          caption: caption,
          createdAt: serverTimestamp(),
          username: user.user.username,
          email: auth.currentUser?.email,
          likes: [],
          comments: [],
        };
        await setDoc(postRef, post);

        toast.success("Image uploaded successfully!", {
          id: toastId,
        });
      } catch (e) {
        console.log(e);
        toast.error("Unable to upload image!", {
          id: toastId,
        });
      } finally {
        setIsUploading(false);
        setFile(undefined);
        setPreview("");
        dispatch({
          type: ActionTypesEnum.SET_IS_UPLOAD_MODAL_OPEN,
          payload: {
            isUploadModalOpen: false,
          },
        });
      }
    } else {
      toast.error("No file selected!");
    }
  };

  return (
    <Modal closeModal={handleModalClose} isOpen={isUploadModalOpen}>
      <Dialog.Panel className="md:w-[40%] h-fit transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
        <Dialog.Title
          as="h3"
          className="text-3xl text-center text-gray-900 font-bold border-b-4 border-gray-200 pb-5"
        >
          Upload Photo
        </Dialog.Title>

        <div className="mt-2 overflow-hidden">
          {(preview && (
            <Image
              src={preview}
              alt="upload pic preview"
              height={500}
              width={500}
              className="object-cover w-fit mx-auto border border-gray-400 rounded-lg"
            />
          )) || <SlPicture className="text-7xl opacity-25 mx-auto" />}
        </div>

        <div className="mt-4 flex items-center justify-center">
          {(!preview && (
            <label
              htmlFor="pic"
              // onClick={handleModalClose}
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-xl text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 font-semibold cursor-pointer"
            >
              Select an image to upload
              <input
                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                  if (!e.target.files) {
                    return;
                  }
                  setFile(e.target.files);
                }}
                type="file"
                name="pic"
                id="pic"
                className="hidden"
                multiple={false}
                accept="image/jpeg,image/png"
              />
            </label>
          )) || (
            <div className="flex items-center justify-center flex-col gap-5">
              <input
                type={"text"}
                name="caption"
                placeholder={"Give your photo a caption..."}
                value={caption}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setCaption(e.target.value)
                }
                className="border border-gray-300 outline-none bg-gray-50 focus:bg-white rounded-md px-5 py-2 text-xl"
              />

              <div className="space-x-4">
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-xl text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 font-semibold cursor-pointer disabled:cursor-not-allowed"
                >
                  Upload
                </button>

                <button
                  type="button"
                  onClick={() => setPreview("")}
                  disabled={isUploading}
                  className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-xl text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 font-semibold cursor-pointer disabled:cursor-not-allowed"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      </Dialog.Panel>
    </Modal>
  );
}
