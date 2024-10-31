import React from 'react';
import { Text, View } from 'react-native';

class CurrentTime extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTime: this.getCurrentTimeFormatted()
        };
    }

    componentDidMount() {
        this.intervalID = setTimeout(
            () => this.tick(),
            60000 // Update the time every minute
        );
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    tick() {
        this.setState({
            currentTime: this.getCurrentTimeFormatted()
        });
    }

    getCurrentTimeFormatted() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    render() {
        return <Text style={{ fontSize: 30 }}>{this.state.currentTime}</Text>
    }
}

export default CurrentTime;