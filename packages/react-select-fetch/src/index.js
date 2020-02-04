import AsyncPaginate, { AsyncPaginateBase } from 'react-select-async-paginate';

import withSelectFetch from './withSelectFetch';

export { withSelectFetch };

export default withSelectFetch(AsyncPaginate);
export const SelectFetchBase = withSelectFetch(AsyncPaginateBase);
