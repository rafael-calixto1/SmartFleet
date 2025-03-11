class DriverModel {
    id: number;
    name: string;
    licenseNumber: string;

    constructor(id: number,
                name: string, 
                licenseNumber: string
    ) {
        this.id = id;
        this.name = name;
        this.licenseNumber = licenseNumber;
    }
}

export default DriverModel;
