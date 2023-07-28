import { Head } from "$fresh/runtime.ts";
import { useSignal } from "@preact/signals";
import { Phone } from "../islands/phone.tsx";

export default function Home() {
  const count = useSignal(3);
  return (
    <>
      <Head>
        <title>utest2</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/style.css" />
      </Head>
      <div class="px-4 py-8 mx-auto bg-[#86efac]">
        <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
          <img
            class="my-6"
            src="/logo.svg"
            width="128"
            height="128"
            alt="the fresh logo: a sliced lemon dripping with juice"
          />
          <h1 class="text-4xl font-bold">USSD Test</h1>
          <p class="my-4">
            Write the details and then press the dial button
          </p>
        </div>
        <br />
        <Phone />
      </div>
    </>
  );
}
