import {Component} from 'react';
import content from "../data.json";
interface LocationState {
    data: Measurement[];
}

interface Measurement {
    heading: any;
    coordinates: any[];
}

//Displays the measurements stored in data.json as a list.
class Location extends Component<{}, LocationState> {

    constructor(props: any) {
        super(props);
        this.state = {
            data: content.values
        };
    }

    render() {
        return (
            <div>
                <ul>
                    {content.values.map((value, key) =>
                        <li key={key}>Heading: {value.heading}, Lat: {value.coordinates[0]}, Long: {value.coordinates[1]}</li>
                    )}
                </ul>
            </div>
        )
    }
}

export default Location;
