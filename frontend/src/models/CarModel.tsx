class CarModel {
    id: number;
    make: string;
    model: string;
    current_kilometers: number;
    next_tire_change: number;
    is_next_tire_change_bigger: boolean;
    next_oil_change: number;
    is_next_oil_change_bigger: boolean;
    license_plate: string; 
    driver_id?: number;
    driver_name: string;
    status: 'active' | 'inactive';

    constructor(
        id: number,
        make: string,
        model: string,
        current_kilometers: number,
        next_tire_change: number,
        is_next_tire_change_bigger: boolean,
        next_oil_change: number,
        is_next_oil_change_bigger: boolean,
        license_plate: string,
        driver_name: string, 
        driver_id?: number,
        status: 'active' | 'inactive' = 'active'
    ) {
        this.id = id;
        this.make = make;
        this.model = model;
        this.current_kilometers = current_kilometers;
        this.next_tire_change = next_tire_change;
        this.is_next_tire_change_bigger = is_next_tire_change_bigger;
        this.next_oil_change = next_oil_change;
        this.is_next_oil_change_bigger = is_next_oil_change_bigger;
        this.license_plate = license_plate;
        this.driver_name = driver_name;
        this.driver_id = driver_id;
        this.status = status;
    }
}

export default CarModel;
