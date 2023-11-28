"use client";
import Link from "next/link";
import React from "react";

const Forbidden = ({ status, error, message }) => {
  return (
    <div class="grid h-screen px-4 bg-sidebar place-content-center dark:bg-gray-900">
      <div class="text-center">
        <h1 class="font-black text-gray-200 text-9xl dark:text-gray-700">
          {status}
        </h1>

        <p class="text-2xl mt-2 font-bold tracking-tight text-white sm:text-4xl">
          {error}
        </p>

        <p class="mt-4 text-gray-400 text-xl">{message}</p>

        <Link
          href="/"
          class="inline-block px-5 py-3 mt-6 text-sm font-medium text-white bg-primary rounded hover:bg-indigo-700 focus:outline-none focus:ring"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;
