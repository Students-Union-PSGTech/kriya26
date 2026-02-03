import React from 'react';

const NumberAndTagForMobile = ({ number, tag }) => {
    const condition = "text-white";

    return (
        <div className={`space-y-2 flex flex-col justify-center ${condition} transition-color duration-300 ease-in-out`}>
            <h1 className="text-6xl font-poppins font-bold text-center bg-gradient-to-bl from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">
                {parseInt(number) % 10 === parseInt(number) ? `0${number}` : number}
            </h1>
            <p className="text-xs tracking-widest text-center uppercase">{tag}</p>
        </div>
    );
};

export default NumberAndTagForMobile