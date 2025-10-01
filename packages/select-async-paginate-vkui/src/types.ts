import type { ReactNode } from "react";

export type RenderDropdownProps = {
	defaultDropdownContent: ReactNode;
	hasMore: boolean;
	isLoading: boolean;
	inputValue: string;
};
