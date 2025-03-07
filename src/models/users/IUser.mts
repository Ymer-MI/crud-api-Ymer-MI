interface IAddress {
    street: string,
    zip: number,
    city: string

}
export interface IUser {
    name: string,
    address: IAddress,
    profession?: string,
    bio?: string
}