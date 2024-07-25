import { useEffect } from "react";

const useDetectOutsideClick = (ref: any, toggleElem: any) => {
  useEffect(() => {
    const onClick = (e: any) => {
      if (ref.current != null && !ref.current.contains(e.target)) {
        toggleElem(false);
      }
    };

    window.addEventListener("mousedown", onClick);

    return () => {
      window.removeEventListener("mousedown", onClick);
    };
  }, [ref, toggleElem]);
};

export default useDetectOutsideClick;
