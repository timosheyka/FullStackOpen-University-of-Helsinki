const Notification = ({ message }) => {    
    return message === null
        ? null
        : (<div className='addition'>{message}</div>)
}

export default Notification