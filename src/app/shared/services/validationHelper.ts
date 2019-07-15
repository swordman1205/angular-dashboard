import { DataRowStates } from '../data/enums/data-row-state.enum';


export namespace ValidationHelper {

    export function validatDuplicateByName(arr: any[], prop: string = 'Name'): string {
        let count = 0;
        let err: string = null;

        const dic: { [propName: string]: object } = {};
        arr.forEach((obj: object) => {
            if (obj.hasOwnProperty('RowState')) {
                if (obj['RowState'] !== DataRowStates.UNCHANGED && obj['RowState'] !== DataRowStates.DELETED) {
                    count++;
                }
            }

            if (dic[obj[prop]]) {
                err = obj[prop];
            }

            dic[obj[prop]] = obj;
        });

        if (count === 0) {
            err = null;
        }

        return err;
    }


    export function validatEmptyName(arr: any[], prop: string = 'Name'): boolean {
        let count = 0;
        let flg = true;

        arr.forEach((obj: object) => {
            if (obj.hasOwnProperty('RowState')) {
                if (obj['RowState'] !== DataRowStates.UNCHANGED && obj['RowState'] !== DataRowStates.DELETED) {
                    count++;
                }
            }

            if (obj[prop] == null || obj[prop] === '' || !(obj[prop].match(/^\s+$/) === null)) {
                flg = false;
            }
        });

        if (count === 0) {
            flg = true;
        }

        return flg;
    }
}
