import { useState } from "react";


// This hook is to check if the user is online or offline
const useOnlineStatus = () => {

    const [onlineStatus, setOnlineStatus] = useState(true);

    useEffect(() => {

        window.addEventListener("offline", () => {
            setOnlineStatus(false);
        })

        window.addEventListener("online", () => {
            setOnlineStatus(true);
        })

    }, [])

    return onlineStatus;
}

export default useOnlineStatus;