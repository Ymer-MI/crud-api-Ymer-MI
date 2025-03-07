export interface UserDTO {
    id: number,
    name: string,
    address: {
        street: string,
        zip: number,
        city: string
    },
    headline?: string,
}