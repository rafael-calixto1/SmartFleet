export interface MaintenanceHistoryModel {
    id?: number;
    car_id: number;
    maintenance_type_id: number;
    maintenance_date: string;
    maintenance_kilometers: number;
    observation?: string;
    recurrency?: number;
    
    // Joined fields from other tables
    maintenance_type_name?: string;
    make?: string;
    model?: string;
    license_plate?: string;
}

export const emptyMaintenanceHistory: MaintenanceHistoryModel = {
    car_id: 0,
    maintenance_type_id: 0,
    maintenance_date: new Date().toISOString().split('T')[0],
    maintenance_kilometers: 0,
    observation: '',
    recurrency: 0
}; 