import React from "react";
import Logo from "public/transparent-logo.png";
import Image from "next/image";
import { Heading, InputGroup, Text, Input } from "@chakra-ui/react";

function login() {
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="mx-4 w-full max-w-xl space-y-2">
        {/* <header>
          <Image src={Logo} alt="logo" width={100} height={100}></Image>
        </header> */}
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-bold text-zinc-800">Welcome Back!</h1>
          <p>
            Hi there! Sign up an account and enjoy your shopping experience on
            Sugar Beach.
          </p>

          <div>
            <InputGroup colorScheme="purple">
              <Input colorScheme="purple"></Input>
            </InputGroup>
          </div>
        </div>
      </div>
    </div>
  );
}

export default login;
