
const handleError = (setNotification, error) => {
    console.log(error)
    setNotification(error)
    setTimeout(() => {
        setNotification(null)
    }, 3000);
}
export default { handleError }