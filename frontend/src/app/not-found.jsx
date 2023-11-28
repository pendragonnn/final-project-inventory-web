import Error from "@/components/Errors/Error";
import React from "react";

const NotFound = () => {
  return (
    <Error
      status={404}
      error={"Not Found !"}
      message={`Oops, The page your requested could not be found.
  `}
    />
  );
};

export default NotFound;
