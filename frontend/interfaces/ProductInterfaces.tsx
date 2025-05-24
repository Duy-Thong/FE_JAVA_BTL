export interface ProductProps {
    id: string;
    retailer: string;
    img_url: string;
    name: string;
    price: string;
    url: string;
    category: string;
}

export interface ProductManagerProps {
    productsData: ProductProps[];
}
