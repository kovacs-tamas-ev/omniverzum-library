export class ImportBookDto {
    'Azonosító': number;
    'Leltári szám': string;
    tipus: number;
    'Szerző': string;
    'Cím': string;
    kiado: number;
    targykor: number;
    mufaj: number;
    sorozat: number;
    Polc: number;
    ISBN: string;
    elojegyez: 'I' | 'N';
    beszallito: number;
    polcon: 'I' | 'N';
    torolve: 'I' | 'N';
    'Kiadó': string;
    'Tárgykör': string;
    'Műfaj': string;
    nyelv: number;
    kolcsido: number;
    kolcsonozheto: 'I' | 'N';
    megvasarolhato: 'I' | 'N';
    'Saját azon.': string;

}