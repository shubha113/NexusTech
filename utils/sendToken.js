export const sendToken = (res, user, message, statusCode = 200) =>{
    const token = user.getJWTToken();
    const options = {httpOnly: true, expires: new Date(Date.now()+15*24*60*60*1000),sameSite:"none", secure:true}
    res.status(statusCode).cookie("token", token, options).json({
        success:true, 
        message, 
        user,
    })
}