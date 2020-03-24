import React from 'react'

const Notification = (props) => {
    if(!props.notification) {
        return null
    }

    return <div className='notification'>{props.notification}</div>
}

export default Notification