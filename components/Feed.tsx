import NavBar from "./NavBar";
import Stories from "./Stories";
import Posts from "./Posts";
import UploadModal from "./UploadModal";

export default function Feed() {
  return (
    <div className="w-full h-full">
      <NavBar />
      <UploadModal />

      <div className="grid w-full grid-cols-3 gap-6 mt-24">
        <main className="w-full max-w-screen-lg mx-auto col-span-3 md:col-span-2">
          <Stories />
          <Posts />
        </main>

        <aside className="hidden md:block col-span-1 bg-red-400 place-self-start">
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident
            beatae voluptas numquam odit quidem iure sed ipsa, placeat
            temporibus rerum aliquid, consequatur illum culpa cupiditate eaque
            quod architecto quibusdam nobis similique vitae officiis? Architecto
            quam praesentium quasi fuga, commodi quisquam optio quidem eaque
            aliquam minima deleniti neque animi maiores quod voluptates, quis
            labore iusto asperiores eius, necessitatibus nulla obcaecati nobis
            doloribus! Cupiditate deserunt perspiciatis corrupti nesciunt
            quibusdam in error reprehenderit laborum quisquam molestias eveniet
            labore quis iusto, neque asperiores repudiandae? Mollitia magni
            libero officiis ut accusantium perspiciatis, vitae, laborum
            repellendus hic itaque quam, non cupiditate? Doloremque temporibus
            magnam ad ullam!
          </p>
        </aside>
      </div>
    </div>
  );
}
