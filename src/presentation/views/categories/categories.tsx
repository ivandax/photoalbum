import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Add as AddIcon } from '@material-ui/icons';

//components
import Loader from '../../components/loader';
import CreateCategory from '../../components/createCategory';
import PostReferenceTable from '../../components/postReferenceTable';

//hooks
import useResetHeaderToggle from '../../../customHooks/useResetHeaderToggle';

import { State } from '../../../redux/index';

//styles
import './categories.scss';

const Categories = (): JSX.Element => {
    useResetHeaderToggle();
    const history = useHistory();
    const sessionData = useSelector((state: State) => state.session.sessionData);

    const [openCreateCategory, setOpenCreateCategory] = useState(false);

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
                <div className="folders">
                    <div className="foldersContent">
                        <CreateCategory
                            isOpen={openCreateCategory}
                            onClose={() => setOpenCreateCategory(false)}
                        />
                        <PostReferenceTable />
                        <div className="categoriesToolbar">
                            {sessionData.data.isAdmin ? (
                                <button onClick={() => setOpenCreateCategory(true)}>
                                    <AddIcon />
                                </button>
                            ) : (
                                <div className="spacer"></div>
                            )}
                        </div>
                    </div>
                </div>
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
