export class ApiError extends Error {
	statusCode: number;
	message: string;
	errors: []|undefined;
	stack: string;
	success: boolean;
	constructor(
		statusCode: number,
		message: string,
		errors?: []|undefined,
		stack?: string,
	) {
		super(message);
		this.statusCode = statusCode;
		this.message = message;
		this.success = false;
		this.errors = errors;

		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}
