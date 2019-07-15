import { JsonObject, JsonProperty } from '../services/io/json-metadata';
import { DataRowStates } from '../data/enums/data-row-state.enum';
import { IECSObject } from '../interfaces/ecsObject';






@JsonObject
export class GeneratedReport implements IECSObject {
    @JsonProperty
    Seq?: number;
    @JsonProperty
    ID: number;
    @JsonProperty
    LocationID: number;
    @JsonProperty
    UserID: number;
    @JsonProperty
    ReportID: number;
    @JsonProperty
    CreateDate: Date;
    @JsonProperty
    StartDate: Date;
    @JsonProperty
    EndDate: Date;
    @JsonProperty
    IncludeWarnings: boolean;
    @JsonProperty
    OnlyAlarms: boolean;
    @JsonProperty
    VirtualName: string;
    @JsonProperty
    Format: string;
    @JsonProperty
    Status: number;
    @JsonProperty({ type: Array, elements: { type: Number } })
    LocationIDs: Array<number>;
    @JsonProperty({ type: Array, elements: { type: Number } })
    AssetIDs: Array<number>;
    StringLocationIDs: string;
    StringAssetIDs: string;
    UserName: string;
    BGColor: number;

    RowState: number = DataRowStates.UNCHANGED;
    Style: any;
    CreateTime: number;



    constructor(xml: string = null) {
        if (xml) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xml, 'text/xml');
            const nodes: NodeList = xmlDoc.children[0].childNodes;

            nodes.forEach((node: Node) => {
                switch (node.nodeName) {
                    case 'ID': {
                        this.ID = parseInt(node.textContent, 10);
                        break;
                    }

                    case 'LocationID': {
                        this.LocationID = parseInt(node.textContent, 10);
                        break;
                    }

                    case 'UserID': {
                        this.UserID = parseInt(node.textContent, 10);
                        break;
                    }

                    case 'ReportID': {
                        this.ReportID = parseInt(node.textContent, 10);
                        break;
                    }

                    case 'CreateDate': {
                        this.CreateDate = new Date(node.textContent);
                        break;
                    }

                    case 'StartDate': {
                        this.StartDate = new Date(node.textContent);
                        break;
                    }

                    case 'EndDate': {
                        this.EndDate = new Date(node.textContent);
                        break;
                    }

                    case 'IncludeWarnings': {
                        this.IncludeWarnings = node.textContent === 'true';
                        break;
                    }

                    case 'OnlyAlarms': {
                        this.OnlyAlarms = node.textContent === 'true';
                        break;
                    }

                    case 'VirtualName': {
                        this.VirtualName = node.textContent;
                        break;
                    }


                    case 'Format': {
                        this.Format = node.textContent;
                        break;
                    }

                    case 'Status': {
                        this.Status = parseInt(node.textContent, 10);
                        break;
                    }

                    case 'UserName': {
                        this.UserName = node.textContent;
                        break;
                    }

                    case 'LocationIDs': {

                        break;
                    }

                    case 'AssetIDs': {

                        break;
                    }
                }
            });
        }
    }
}
