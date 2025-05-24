export interface UserManagerProps {
    usersData: UserProps[];
}

export interface UserProps {
    modifiedDate: string;
    createdDate: string;
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
}