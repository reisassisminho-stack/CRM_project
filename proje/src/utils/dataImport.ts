import { v4 as uuidv4 } from 'uuid';
import type { Client } from '../types';

export interface ImportMapping {
    fileHeader: string;
    targetField: keyof Client | 'ignore' | 'subContact';
}

export const parseCSV = (text: string): string[][] => {
    // Simple CSV parser that handles quotes
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                currentField += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            currentRow.push(currentField.trim());
            currentField = '';
        } else if ((char === '\r' || char === '\n') && !inQuotes) {
            if (currentField || currentRow.length > 0) {
                currentRow.push(currentField.trim());
                rows.push(currentRow);
            }
            currentRow = [];
            currentField = '';
            if (char === '\r' && nextChar === '\n') i++;
        } else {
            currentField += char;
        }
    }

    if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
    }

    return rows;
};

export const mapDataToClients = (
    data: string[][],
    mappings: ImportMapping[],
    userId: string
): Client[] => {
    const headers = data[0];
    const rows = data.slice(1);
    const now = new Date().toISOString();

    return rows.map(row => {
        const client: any = {
            id: uuidv4(),
            userId: userId,
            createdAt: now,
            updatedAt: now,
            subContacts: [],
            companyName: '',
            contactName: '',
            email: '',
            phone: '',
            paymentConditions: 'A definir',
            notes: ''
        };

        mappings.forEach(mapping => {
            if (mapping.targetField === 'ignore') return;

            const headerIndex = headers.indexOf(mapping.fileHeader);
            if (headerIndex === -1) return;

            const value = row[headerIndex];
            if (value === undefined) return;

            if (mapping.targetField === 'subContact') {
                // Simplified sub-contact handling if mapped
                client.subContacts.push({
                    id: uuidv4(),
                    name: value,
                    role: 'Contacto Base',
                    phone: '',
                    email: ''
                });
            } else {
                client[mapping.targetField] = value;
            }
        });

        return client as Client;
    });
};
