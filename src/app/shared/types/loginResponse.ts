import { JsonObject, JsonProperty } from '../services/io/json-metadata';


export class LoginResponse {
    @JsonProperty
    AccountStatus: number;
    @JsonProperty
    DropPassValidation: boolean;
    @JsonProperty
    LockWarnning: any;
    @JsonProperty
    Ticket: string;
    @JsonProperty
    UserID: number;



    constructor(accountStatus: number, dropPassValidation: boolean, lockWarnning: any, ticket: string, userID: number) {
        this.AccountStatus = accountStatus;
        this.DropPassValidation = dropPassValidation;
        this.LockWarnning = lockWarnning;
        this.Ticket = ticket;
        this.UserID = userID;
    }
}
