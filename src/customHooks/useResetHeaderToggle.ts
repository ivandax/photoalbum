import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { hideHeader } from '../redux/headerToggleReducer';

function useResetHeaderToggle(): null {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(hideHeader());
    }, []);

    return null;
}

export default useResetHeaderToggle;
