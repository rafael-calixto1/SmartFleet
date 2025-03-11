// Atualizando o modelo FuelingHistoryModel
class FuelingHistoryModel {
    id: number;
    carId: number;
    litersQuantity: number;
    fuelDate: string;
    fuelingKilometers: number;
    pricePerLiter: number;
    totalCost: number;
    fuelType: string;
    licensePlate?: string;
    observation?: string;
    carModel?: string;

    constructor(
        id: number,
        carId: number,
        litersQuantity: number,
        fuelDate: string,
        fuelingKilometers: number,
        pricePerLiter: number,
        totalCost: number,
        fuelType: string,
        licensePlate?: string,
        observation?: string,
        carModel?: string
    ) {
        this.id = id;
        this.carId = carId;
        this.litersQuantity = litersQuantity;
        this.fuelDate = fuelDate;
        this.fuelingKilometers = fuelingKilometers;
        this.pricePerLiter = pricePerLiter;
        this.totalCost = totalCost;
        this.fuelType = fuelType;
        this.licensePlate = licensePlate;
        this.observation = observation;
        this.carModel = carModel;
    }
}

export default FuelingHistoryModel;
