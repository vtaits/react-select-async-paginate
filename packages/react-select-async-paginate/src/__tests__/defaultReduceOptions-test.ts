import { defaultReduceOptions } from "../defaultReduceOptions";

test("should concat options by default", () => {
	expect(defaultReduceOptions([1, 2], [3, 4])).toEqual([1, 2, 3, 4]);
});
