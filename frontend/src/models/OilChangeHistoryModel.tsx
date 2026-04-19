class OilChangeHistoryModel {
    id: number;
    carId: number;
    oilChangeDate: string; 
    oilChangeKilometers: number;
    liters_quantity: number;
    price_per_liter: number;
    total_cost: number;
    observation?: string;
    make?: string;
    model?: string;
    license_plate?: string;
    carStatus?: 'active' | 'inactive';

    constructor(
        id: number,
        carId: number,
        oilChangeDate: string,
        oilChangeKilometers: number,
        liters_quantity: number,
        price_per_liter: number,
        total_cost: number,
        observation?: string,
        make?: string,
        model?: string,
        license_plate?: string,
        carStatus?: 'active' | 'inactive'
    ) {
        this.id = id;
        this.carId = carId;
        this.oilChangeDate = oilChangeDate;
        this.oilChangeKilometers = oilChangeKilometers;
        this.liters_quantity = liters_quantity;
        this.price_per_liter = price_per_liter;
        this.total_cost = total_cost;
        this.observation = observation;
        this.make = make;
        this.model = model;
        this.license_plate = license_plate;
        this.carStatus = carStatus;
    }
}

export default OilChangeHistoryModel;
