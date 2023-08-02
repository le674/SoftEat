import { TextItem } from "pdfjs-dist/types/src/display/api"
import { TextShared } from "./text"

export interface FactureColumns {
    name: Array<string>,
    description: Array<string>,
    price: Array<string>,
    quantity: Array<string>,
    tva: Array<string>
}

export interface FactureColumnsPdf {
    name: Array<string>,
    description: Array<string>,
    price: Array<string>,
    quantity: Array<string>,
    tva: Array<string>,
    total: Array<string>
}

export interface FactureColumnsFull {
    name: TextShared[],
    description?: TextShared[],
    price: TextShared[],
    quantity: TextShared[],
    tva?: TextShared[],
    total?: TextShared[]
}

export interface FacturePivotsFull {
    name: TextShared,
    description?: TextShared,
    price: TextShared,
    quantity: TextShared,
    tva?: TextShared,
    total?: TextShared
}


export interface FacturePivotsFullPdf {
    name: TextItem,
    description?: TextItem,
    price: TextItem,
    quantity: TextItem,
    tva?: TextItem,
    total?: TextItem
}

export interface FacturePrintedResult {
    name: string;
    description?: string | undefined;
    price: number;
    quantity: number;
    tva?: number | undefined;
    total?: number | undefined;
}