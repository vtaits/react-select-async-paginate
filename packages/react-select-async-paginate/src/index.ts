import Select from "react-select";
import { withAsyncPaginate } from "./withAsyncPaginate";

export { wrapMenuList } from "./components/wrapMenuList";
export { reduceGroupedOptions } from "./reduceGroupedOptions";

export { withAsyncPaginate };

export {
	checkIsResponse,
	validateResponse,
} from "./validateResponse";
export { useAsyncPaginateBase } from "./useAsyncPaginateBase";
export { useAsyncPaginate } from "./useAsyncPaginate";
export { useComponents } from "./components/useComponents";

export const AsyncPaginate = withAsyncPaginate(Select);

export * from "./types";
