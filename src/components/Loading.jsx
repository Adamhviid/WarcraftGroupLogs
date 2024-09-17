import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

function Loading({ loading }) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setMessage("Sorry for the delay. Servers are expensive \nContacting server, please allow a wait up to 30 seconds.");
      }, 10000);

      return () => clearTimeout(timer);
    } else {
      setMessage("");
    }
  }, [loading]);

  return (
    <>
      {loading ? (
        <>
          <ClipLoader
            color="#ffffff"
            loading={loading}
            cssOverride={{ margin: "20px" }}
          />
          {message && <p style={{ whiteSpace: "pre-line" }}>{message}</p>}
        </>
      ) : null}
    </>
  );
}

export default Loading;
