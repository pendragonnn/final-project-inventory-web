import Error from "@/components/Errors/Error";
import React from "react";

const ForbiddenPage = () => {
  return (
    <Error
      status={403}
      error={"Forbidden !"}
      message={`Oops, You don't have permission to access this page.
  `}
    />
  );
};

export default ForbiddenPage;
