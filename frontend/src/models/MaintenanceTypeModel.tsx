export interface MaintenanceTypeModel {
    id?: number;
    name: string;
    recurrency: number;
    recurrency_date: number;
}

export const emptyMaintenanceType: MaintenanceTypeModel = {
    name: '',
    recurrency: 0,
    recurrency_date: 0
}; 