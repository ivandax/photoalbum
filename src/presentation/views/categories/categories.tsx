import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

//components
import Loader from '../../components/loader';

//hooks
import useResetHeaderToggle from '../../../customHooks/useResetHeaderToggle';

import { State } from '../../../redux/index';

//styles
import './categories.scss';

const Categories = (): JSX.Element => {
    useResetHeaderToggle();
    const history = useHistory();
    const sessionData = useSelector((state: State) => state.session.sessionData);

    useEffect(() => {
        if (sessionData.status === 'failed') {
            history.push('./login');
        }
    }, [sessionData.status]);

    switch (sessionData.status) {
        case 'pending':
        case 'ongoing':
        case 'failed':
            return <Loader />;
        case 'successful':
            return sessionData.data.role === 'member' ? (
                <div className="categories">Categories</div>
            ) : (
                <div className="securityNotice">
                    <p>
                        El administrador debe proporcionarle derechos de creación y
                        edición.
                    </p>
                </div>
            );

        default:
            return <></>;
    }
};
export default Categories;
