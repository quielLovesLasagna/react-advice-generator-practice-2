import { useReducer } from "react";

// API
const ADVICEAPI = "https://api.adviceslip.com/advice";

const initialState = { advice: "", adviceID: "", isLoading: false, error: "" };

function reducer(state, action) {
	switch (action.type) {
		case "advice":
			return { ...state, advice: action.payload };
		case "adviceID":
			return { ...state, adviceID: action.payload };
		case "loading":
			return { ...state, isLoading: action.payload };
		case "error":
			return { ...state, error: action.payload };
		default:
			throw new Error("Unknown action");
	}
}

export function useAdvice() {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { advice, adviceID, isLoading, error } = state;

	function setAdvice(advice) {
		dispatch({ type: "advice", payload: advice });
	}

	function setAdviceID(adviceID) {
		dispatch({ type: "adviceID", payload: adviceID });
	}

	function setIsLoading(status) {
		dispatch({ type: "loading", payload: status });
	}

	function setError(error) {
		dispatch({ type: "error", payload: error });
	}

	// const [advice, setAdvice] = useState("");
	// const [adviceID, setAdviceID] = useState("");
	// const [isLoading, setIsLoading] = useState(false);
	// const [error, setError] = useState("");

	async function getAdvice() {
		try {
			setIsLoading(true);
			setError("");

			const res = await fetch(ADVICEAPI);

			if (!res.ok) {
				throw new Error("There was a problem fetching the data!");
			}

			const data = await res.json();

			if (data.slip && data.slip.advice) {
				const { advice, id } = data.slip;
				setAdvice(advice);
				setAdviceID(id);
			} else {
				throw new Error("Couldn't get advice, try again later!");
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	}

	return { advice, adviceID, isLoading, error, getAdvice };
}
