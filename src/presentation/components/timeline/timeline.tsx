import React from 'react';
// import * as O from 'fp-ts/lib/Option';
// import { pipe } from 'fp-ts/pipeable';
// import { flow } from 'fp-ts/lib/function';

//persistence
//import { Post } from '../../../persistence/posts';
import { UserWithId } from '../../../persistence/users';

import './timeline.scss';

interface TimelineProps {
    sessionData: UserWithId;
}

const Timeline = (props: TimelineProps): JSX.Element => {
    const { sessionData } = props;
    console.log(sessionData);

    //const [postList, setPostList] = useState<Post[]>([]);

    return <div className="timeline"></div>;
};

export default Timeline;
