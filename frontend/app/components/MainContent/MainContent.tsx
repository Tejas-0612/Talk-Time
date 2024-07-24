import Image from "next/image";

function MainContent() {
  return (
    <div className="h-[60vh] flex justify-center items-center ">
      <div className="mt-auto flex flex-col gap-4">
        <div className="flex justify-center items-center">
          <Image
            className="drop-shadow-lg"
            src="/logo.png"
            alt="Chat App"
            width={120}
            height={120}
          />
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-4xl text-center text-gray-800 dark:text-white">
            Welcome to{" "}
            <span className="font-bold dark:gradient-text">TalkTime</span>
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300">
            Start a conversation with your friends now!
            <span role="img" aria-label="smile">
              😊
            </span>
            <br />
            <span>
              Discover new connections and enjoy seamless communication.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default MainContent;
