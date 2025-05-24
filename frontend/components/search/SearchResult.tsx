import Link from 'next/link';
import Image from 'next/image';
import { ProductProps } from '@/interfaces/ProductInterfaces';

import { useRouter } from 'next/navigation';

// interface Product {
//     id: number;
//     url: string;
//     image: string;
//     name: string;
//     info: string;
//     oldPrice: string;
//     newPrice: string;
// }

interface SearchResultProps {
    results: ProductProps[];
    setIsOpenSearchResult: any;
}

const SearchResult = (props: SearchResultProps) => {
    const { results, setIsOpenSearchResult } = props;

    const router = useRouter();

    return (
        <div className="absolute left-0 right-0 top-[64px] h-auto max-h-[500px] overflow-y-auto rounded-b-md bg-white p-4 pt-3 shadow-md">
            <div>
                <h3 className="mb-4 text-base font-bold">Kết quả tìm kiếm</h3>
            </div>

            <ul className="flex flex-col">
                {!!results.length ? (
                    results.map((item, index) => (
                        <li
                            key={item.id || index}
                            onClick={() => setIsOpenSearchResult(false)}
                        >
                            <Link
                                href={`/product/${item.id}`}
                                className="flex flex-row items-center gap-4 overflow-hidden rounded-md px-4 py-3 text-base transition-colors hover:bg-gray-100"
                            >
                                <div className="relative h-14 w-14">
                                    <Image
                                        src={item.img_url}
                                        alt="iphone"
                                        fill
                                        className="h-full w-full bg-center object-cover"
                                    />
                                </div>
                                <div className="line-clamp-2 flex-1">
                                    {item.name}
                                </div>
                            </Link>
                        </li>
                    ))
                ) : (
                    <div>Không tìm thấy sản phẩm nào</div>
                )}
            </ul>
        </div>
    );
};

export default SearchResult;
