//here we will make a middleware to catch the async errors, so for that we will makw a function which will 
//return another arrow function
export const catchAsyncError = (passedFunction)=> (req, res, next)=>{
    Promise.resolve(passedFunction(req, res, next)).catch(next);
} 