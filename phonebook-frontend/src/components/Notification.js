
import React from "react";


const Notification = ({notification}) => {
    if (notification.text === null)
        return null;

    const notificationStyle =  {
        color: notification.isWarning ? 'red' : 'green', // Conditional coloring!
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    };
    
    return (
        <div style={notificationStyle}>
            {notification.text}
        </div>
    );
}


export default Notification;
