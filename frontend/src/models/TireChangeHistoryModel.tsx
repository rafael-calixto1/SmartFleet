class TireChangeHistoryModel {
    id: number;
    carId: number;
    tireChangeDate: string; 
    tireChangeKilometers: number;
    make?: string;
    model?: string;
    licensePlate?: string;

    constructor(
        id: number,
        carId: number,
        tireChangeDate: string,
        tireChangeKilometers: number,
        make?: string,
        model?: string,
        licensePlate?: string
    ) {
        this.id = id;
        this.carId = carId;
        this.tireChangeDate = tireChangeDate;
        this.tireChangeKilometers = tireChangeKilometers;
        this.make = make;
        this.model = model;
        this.licensePlate = licensePlate;
    }
}

export default TireChangeHistoryModel;


