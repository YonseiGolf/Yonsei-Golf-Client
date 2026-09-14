import { errorMessage } from '@/lib/api'
import { useCallback, useEffect, useRef, useState } from 'react'

export function useQuery<T>(
	key: string,
	fetcher: (signal: AbortSignal) => Promise<T>,
	enabled = true,
) {
	const fetcherRef = useRef(fetcher)
	fetcherRef.current = fetcher
	const [revision, setRevision] = useState(0)
	const [state, setState] = useState<{ key: string; data?: T; loading: boolean; error: string }>({
		key,
		loading: enabled,
		error: '',
	})
	const reload = useCallback(() => setRevision((value) => value + 1), [])
	// biome-ignore lint/correctness/useExhaustiveDependencies: revision deliberately invalidates a previously loaded query.
	useEffect(() => {
		if (!enabled) return
		const controller = new AbortController()
		// Keep the same view mounted during a refresh (e.g. after closing a dialog).
		// Changing the query key still clears the old route/filter's data immediately.
		setState((previous) => ({
			key,
			data: previous.key === key ? previous.data : undefined,
			loading: true,
			error: '',
		}))
		fetcherRef.current(controller.signal).then(
			(data) => {
				if (!controller.signal.aborted) setState({ key, data, loading: false, error: '' })
			},
			(error: unknown) => {
				if (!controller.signal.aborted)
					setState((previous) => ({
						key,
						data: previous.key === key ? previous.data : undefined,
						loading: false,
						error: errorMessage(error),
					}))
			},
		)
		return () => controller.abort()
	}, [key, revision, enabled])
	return {
		data: state.key === key ? state.data : undefined,
		loading: state.key === key ? state.loading : enabled,
		error: state.key === key ? state.error : '',
		reload,
	}
}
