import React from "react";
import { Link } from "react-router";
import { publicPath } from "../../lib/utils";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div
          className="relative items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid bg-cover"
          style={{ backgroundImage: "url('/images/cake.jpg')" }}
        >
          <div className="absolute inset-0 bg-white opacity-30" />
          <div className="relative flex items-center justify-center z-1">
            <div className="flex flex-col items-center justify-center  bg-white/50 rounded-full p-6 w-74 h-74 backdrop-blur-sm">
              <Link to="/" className="block mb-4">
                <img
                  width={231}
                  height={48}
                  src={publicPath("/images/logo/jays-logo-full.png")}
                  alt="Logo"
                />
              </Link>
              <p className="text-center text-gray-800 dark:text-white/60 ">
                A place to manage the cake shop and all the orders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
