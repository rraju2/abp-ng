import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

export interface TabletScreen {
    id: string;
    label: string;
}

export interface TabletSection {
    id: string;
    label: string;
    isSelected: boolean;
    screens: TabletScreen[];
    color: string;
}

@Injectable({
    providedIn: 'root'
})
export class TabletStateService {
    private router = inject(Router);
    private _sections = signal<TabletSection[]>([]);
    private _selectedSectionId = signal<string | null>(null);
    private _isPropertiesOpen = signal(false);

    private _isCreateModalOpen = signal(false);
    private _isScreenModalOpen = signal(false);
    private _targetSectionId = signal<string | null>(null);
    private _isEditingLabel = signal(false);

    readonly sections = this._sections.asReadonly();
    readonly selectedSectionId = this._selectedSectionId.asReadonly();
    readonly isPropertiesOpen = this._isPropertiesOpen.asReadonly();
    readonly isCreateModalOpen = this._isCreateModalOpen.asReadonly();
    readonly isScreenModalOpen = this._isScreenModalOpen.asReadonly();
    readonly isEditingLabel = this._isEditingLabel.asReadonly();
    readonly targetSectionId = this._targetSectionId.asReadonly();

    readonly selectedSection = computed(() =>
        this._sections().find(s => s.id === this._selectedSectionId()) || null
    );

    setEditingLabel(editing: boolean) {
        this._isEditingLabel.set(editing);
    }

    openCreateModal() {
        this._isCreateModalOpen.set(true);
    }

    closeCreateModal() {
        this._isCreateModalOpen.set(false);
    }

    openScreenModal(sectionId: string) {
        this._targetSectionId.set(sectionId);
        this._isScreenModalOpen.set(true);
    }

    closeScreenModal() {
        this._isScreenModalOpen.set(false);
        this._targetSectionId.set(null);
    }

    addSection(label: string) {
        const id = crypto.randomUUID();
        const newSection: TabletSection = {
            id,
            label: label || 'New Section',
            isSelected: true,
            screens: [],
            color: 'bg-indigo-500' // Default color
        };
        this._sections.update(s => [...s, newSection]);
        this.selectSection(id);
        this._isPropertiesOpen.set(true);
        this._isCreateModalOpen.set(false);
    }

    addScreen(label: string) {
        const sectionId = this._targetSectionId();
        if (!sectionId) return;

        const newScreen: TabletScreen = {
            id: crypto.randomUUID(),
            label: label || 'New Screen'
        };

        this._sections.update(sections =>
            sections.map(s => s.id === sectionId
                ? { ...s, screens: [...s.screens, newScreen] }
                : s
            )
        );

        this.closeScreenModal();
    }

    selectSection(id: string | null) {
        this._selectedSectionId.set(id);
        this._isEditingLabel.set(false);
        if (id) {
            this._isPropertiesOpen.set(true);
            this.router.navigate(['/tablet/design'], { queryParams: { id } });
        } else {
            this.router.navigate(['/tablet/design']);
        }
    }

    updateSectionLabel(id: string, newLabel: string) {
        this._sections.update(sections =>
            sections.map(s => s.id === id ? { ...s, label: newLabel } : s)
        );
    }

    updateSectionColor(id: string, color: string) {
        this._sections.update(sections =>
            sections.map(s => s.id === id ? { ...s, color } : s)
        );
    }

    removeScreen(sectionId: string, screenId: string) {
        this._sections.update(sections =>
            sections.map(s => s.id === sectionId
                ? { ...s, screens: s.screens.filter(sc => sc.id !== screenId) }
                : s
            )
        );
    }

    closeProperties() {
        this._isPropertiesOpen.set(false);
    }
}
