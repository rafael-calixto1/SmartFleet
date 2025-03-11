class CarMaintenanceModel {
    id: number;
    carId: number;
    maintenanceType: string;
    maintenanceDate: string;
    maintenanceKilometers: number;
    recurrency: number;
    carMake?: string;
    carModel?: string;
    licensePlate?: string;

    constructor(
        id: number,
        carId: number,
        maintenanceType: string,
        maintenanceDate: string,
        maintenanceKilometers: number,
        recurrency: number,
        carMake?: string,
        carModel?: string,
        licensePlate?: string
    ) {
        this.id = id;
        this.carId = carId;
        this.maintenanceType = maintenanceType;
        this.maintenanceDate = maintenanceDate;
        this.maintenanceKilometers = maintenanceKilometers;
        this.recurrency = recurrency;
        this.carMake = carMake;
        this.carModel = carModel;
        this.licensePlate = licensePlate;
    }
}

export default CarMaintenanceModel;