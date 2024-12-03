export const LogoutUser = (req,res) =>{
    try{
        return res.cookie('token','').status(200).json({message : 'Logout Success',success: true});
    }catch(error){
        return res.status(500).json({message:error.message,error:true})
    }
}