import { Spinner } from "@vkontakte/vkui";
import type { RenderDropdownProps } from "./types";

export function defaultRenderDropdown({
	defaultDropdownContent,
	hasMore,
}: RenderDropdownProps) {
	return (
		<>
			{defaultDropdownContent}

			{hasMore && (
				<Spinner
					size="s"
					style={{
						padding: 5,
					}}
				/>
			)}
		</>
	);
}
