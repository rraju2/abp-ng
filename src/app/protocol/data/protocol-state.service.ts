
import { Injectable, signal } from '@angular/core';

export interface ProtocolData {
    title: string;
    phase: string;
    therapeuticArea?: string;
    siteCapabilities?: string[];
    startDate: string;
    status: string;
    description: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProtocolStateService {
    private _protocolData = signal<ProtocolData | null>(null);

    readonly protocolData = this._protocolData.asReadonly();

    setProtocol(data: ProtocolData) {
        this._protocolData.set(data);
    }

    updateProtocol(data: ProtocolData) {
        this._protocolData.update(current => ({ ...current, ...data }));
    }
}
