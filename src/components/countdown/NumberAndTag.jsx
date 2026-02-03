import React from 'react';


const NumberAndTag = ({ number, tag }) => {
    const condition = "text-white";
    const gradientCondition = "from-[rgba(255,255,255,0.3)] to-[rgba(255,255,255,0.6)]";

    return (
        <div className="relative w-[40ch] number-tag">
            <h1 className={`pr-4 absolute bottom-4 right-4 [line-height:40vh] bg-clip-text [-webkit-text-fill-color:transparent] bg-gradient-to-t ${gradientCondition} text-[30vh] 2xl:text-[40vh] text-red-400 font-oswald font-bold tracking-[-0.1em]`}>
                {parseInt(number) % 10 === parseInt(number) ? `0${number}` : number}
                &nbsp;
            </h1>
            <p className={`absolute right-4 bottom-8 uppercase ${condition} transition-color duration-300 ease-in-out text-5xl font-bold font-oswald`}>
                {tag}
            </p>
        </div>
    );
};

export default NumberAndTag