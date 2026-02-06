"use client"
import clsx from "clsx";

const Button = ({ id, title, rightIcon, leftIcon, containerClass, titleClass, onClick }) => {
  return (
    <button
      id={id}
      onClick={onClick}
      className={clsx(
        "group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full bg-[#dfdff2] px-7 py-3 text-black",
        containerClass
      )}
    >
      {leftIcon}

      <span className={clsx("relative inline-flex overflow-hidden font-general text-xs uppercase !mb-0", titleClass)}>
        <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12 mb-0">
          {title}
        </div>
        <div className="absolute top-0 left-0 h-full w-full translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0 mb-0">
          {title}
        </div>
      </span>

      {rightIcon}
    </button>
  );
};

export default Button;