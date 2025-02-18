export interface IProduct {
  title: string | undefined, 
  price: string,
}

export interface IResult {
  timestamp: string,
  products: IProduct[],
}