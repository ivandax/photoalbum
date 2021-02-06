import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { State } from '../redux/index';

function useCheckSession(): string {
    const sessionData = useSelector((state: State) => state.session.sessionData);
    const [command, setCommand] = useState("wait")

    useEffect(() => {
        if (sessionData.status === 'pending' || sessionData.status === 'ongoing') {
            setCommand("wait");
        } else if (sessionData.status === 'successful') {
            setCommand("stop");
        } else if (sessionData.status === 'failed') {
            setCommand("redirect");
        }
    }, [sessionData.status]);

    return command;
}

export default useCheckSession;
