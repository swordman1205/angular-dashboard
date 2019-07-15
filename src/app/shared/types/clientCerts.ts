import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { DataRowStates } from '../data/enums/data-row-state.enum';


@JsonObject
export class ClientCerts {
    @JsonProperty
    LocationName: string;
    @JsonProperty
    CACert: string;
    @JsonProperty
    ServerCert: string;
    @JsonProperty
    ClientCert: string;
    @JsonProperty
    ClientPrivateKey: string;
    @JsonProperty
    ClientCertPass: string;

    // RowState: number = DataRowStates.UNCHANGED;
}
