import React from "react";

import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";

import { cn } from "@/lib/utils";

const PasswordStrengthChecker: React.FC<{ password: string }> = ({
  password,
}) => {
  const options = {
    translations: zxcvbnEnPackage.translations,
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    dictionary: {
      ...zxcvbnCommonPackage.dictionary,
      ...zxcvbnEnPackage.dictionary,
    },
  };

  zxcvbnOptions.setOptions(options);

  const strength = zxcvbn(password);
  console.log(strength.score);
  return (
    <div className="flex w-full h-2 items-center">
      <div
        className={cn(
          " w-1/4 rounded-xl py-0.5 mr-2",
          strength.score <= 0 ? "bg-zinc-300" : "bg-red-600"
        )}
      ></div>
      <div
        className={cn(
          " w-1/4 rounded-xl py-0.5 mr-2",
          strength.score >= 1 ? "bg-yellow-400" : "bg-zinc-300"
        )}
      ></div>
      <div
        className={cn(
          " w-1/4 rounded-xl py-0.5 mr-2",
          strength.score >= 2 ? "bg-green-300" : "bg-zinc-300"
        )}
      ></div>
      <div
        className={cn(
          " w-1/4 rounded-xl py-0.5 mr-2",
          strength.score >= 3 ? "bg-green-600" : "bg-zinc-300"
        )}
      ></div>
    </div>
  );
};

export default PasswordStrengthChecker;
