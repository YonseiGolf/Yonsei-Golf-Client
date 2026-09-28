import { cn } from '@/lib/utils'
import * as LabelPrimitive from '@radix-ui/react-label'
// Adapted from shadcn/ui new-york-v4; local theme and Korean labels.
import type * as React from 'react'

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
	return (
		<LabelPrimitive.Root
			data-slot="label"
			className={cn(
				'block text-sm leading-normal font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
				className,
			)}
			{...props}
		/>
	)
}

export { Label }
