export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

export interface ProductLink {
  href: string;
  templated?: boolean;
}

export interface ProductResponse {
  _embedded: {
    products: Product[];
  };
  _links: {
    self: ProductLink;
    first: ProductLink;
    next?: ProductLink;
    last: ProductLink;
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}
