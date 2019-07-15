import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';


@JsonObject
export class User implements IECSObject {
    @JsonProperty
    Seq?: number;
    @JsonProperty
    AccountStatus: number;
    @JsonProperty
    ActivationToken: string;
    @JsonProperty
    AddressText: string;
    @JsonProperty
    City: string;
    @JsonProperty
    Comments: string;
    @JsonProperty
    Country: string;
    @JsonProperty
    DropActivation: boolean;
    @JsonProperty
    DropPassValidation: boolean;
    @JsonProperty
    Email: string;
    @JsonProperty
    Email2: string;
    @JsonProperty
    Email3: string;
    @JsonProperty
    EndDate: Date;
    @JsonProperty
    FailedLogins: number;
    @JsonProperty
    Fax: string;
    @JsonProperty
    FirstName: string;
    @JsonProperty
    ID: number;
    @JsonProperty
    IPAddress: string;
    @JsonProperty
    LDAPUser: boolean;
    @JsonProperty
    LastLoginDate: Date;
    @JsonProperty
    LastName: string;
    @JsonProperty
    Locale: string;
    @JsonProperty
    LocationID: number;
    @JsonProperty
    MiddleName: string;
    @JsonProperty
    MobilePhone: string;
    @JsonProperty
    NeedActivation: boolean;
    @JsonProperty
    PINCode: string;
    @JsonProperty
    PassNeverExpires: boolean;
    @JsonProperty
    Password: string;
    @JsonProperty
    PasswordAnswer: string;
    @JsonProperty
    PasswordChanged: Date;
    @JsonProperty
    PasswordQuestion: string;
    @JsonProperty
    Phone1: string;
    @JsonProperty
    Phone2: string;
    @JsonProperty
    PostalCode: string;
    @JsonProperty
    SessionStatus: number;
    @JsonProperty
    ShowWarnings: boolean;
    @JsonProperty
    StartDate: Date;
    @JsonProperty
    State: string;
    @JsonProperty
    Street: string;
    @JsonProperty
    URL: string;
    @JsonProperty
    UserName: string;
    @JsonProperty
    UserTypeID: number;
    @JsonProperty
    ValidationResult: number;
    @JsonProperty
    ZoneName: string;

    RowState: number = DataRowStates.UNCHANGED;
    Sync: boolean;
    UserTypeName: string;
}
