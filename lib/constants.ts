export type FuelType = {
    code: string,
    name: string,
    isPetrol: boolean
}

export const fuelTypes: FuelType[] = [
    // {
    //     code: "E10-U91",
    //     name: "Ethanol 94 / Unleaded 91",
    //     isPetrol: true
    // },
    {
        code: "E10",
        name: "Ethanol 94",
        isPetrol: true
    },
    {
        code: "U91",
        name: "Unleaded 91",
        isPetrol: true
    },
    // {
    //     code: "P95-P98",
    //     name: "Premium 95 / Premium 98",
    //     isPetrol: true
    // },
    {
        code: "P95",
        name: "Premium 95",
        isPetrol: true
    },
    {
        code: "P98",
        name: "Premium 98",
        isPetrol: true
    },
    // {
    //     code: "DL-PDL",
    //     name: "Diesel / Premium Diesel",
    //     isPetrol: true
    // },
    {
        code: "DL",
        name: "Diesel",
        isPetrol: true
    },
    {
        code: "PDL",
        name: "Premium Diesel",
        isPetrol: true
    },
    {
        code: "E85",
        name: "Ethanol 105",
        isPetrol: true
    },
    {
        code: "LPG",
        name: "LPG",
        isPetrol: true
    },
    {
        code: "EV",
        name: "EV charge",
        isPetrol: false
    },
    {
        code: "B20",
        name: "Biodiesel 20",
        isPetrol: true
    },
    {
        code: "LNG",
        name: "LNG",
        isPetrol: false
    },
    {
        code: "H2",
        name: "Hydrogen",
        isPetrol: false
    },
    {
        code: "CNG",
        name: "CNG/NGV",
        isPetrol: false
    }
]