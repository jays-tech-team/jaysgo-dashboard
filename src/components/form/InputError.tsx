export function InputMessage({error, success, message}:{
    error?: boolean,
    success?: boolean,
    message: string
}){
    return <p
    className={`mt-1.5 text-xs ${
      error
        ? "text-error-500"
        : success
        ? "text-success-500"
        : "text-gray-500"
    }`}
  >
    {message}
  </p>
}