export class Contact {
    name: string;
    lastName: string;
    organization: string;
    email: string;
    message: string;

    constructor(name: string, lastname: string, org: string, email: string, message: string) {
        this.name = name;
        this.lastName = lastname;
        this.organization = org;
        this.email = email;
        this.message = message;
    }
}
