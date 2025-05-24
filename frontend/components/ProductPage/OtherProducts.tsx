import React from 'react';
import ProductCard from '../home/ProductCard';

//@ts-ignore
const OtherProducts = ({ data }) => {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {data &&
                //@ts-ignore
                data.map((element) => (
                    <div className="w-full" key={element.id}>
                        <ProductCard data={element}></ProductCard>
                    </div>
                ))}
        </div>
    );
};

export default OtherProducts;
