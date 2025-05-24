import React from 'react';
import { Carousel } from 'antd';
import Image from 'next/image'; // Import next/image

import small1 from '../../app/assets/images/small1.png';
import small2 from '../../app/assets/images/small2.png';
import big1 from '../../app/assets/images/big1.png';
import big2 from '../../app/assets/images/big2.jpg';
import big3 from '../../app/assets/images/big3.jpg';

const Banner = () => {
    return (
        <div className="flex space-x-1">
            <div className="">
                <div>
                    <Image src={small2} alt="" />
                </div>
                <div>
                    <Image src={small1} alt="Image 1" className="mt-2" />
                </div>
            </div>

            <div className="w-1/2">
                <Carousel className="bg-red-300" autoplay>
                    <div className="w-full">
                        <Image src={big1} alt="" className="w-full rounded" />
                    </div>
                    <div className="w-full">
                        <Image src={big2} alt="" className="w-full rounded" />
                    </div>
                    <div className="w-full">
                        <Image src={big3} alt="" className="w-full rounded" />
                    </div>
                </Carousel>
            </div>

            <div className="">
                <div>
                    <Image src={small1} alt="" />
                </div>
                <div>
                    <Image src={small2} alt="Image 1" className="mt-2" />
                </div>
            </div>
        </div>
    );
};

export default Banner;
