import User from '../models/user.js';

const genertaToken = (user) => {
    const accesToken= jwt.sign(
        {
            userId:user._id,

        },
        process.env.ACCESS_TOKEN,
        {
            expiresIn: '2d',
        }
    );

    const refreshToken= jwt.sign(
        {
            userId:user._id,

        },
        process.env.REFRESH_TOKEN,
        {
            expiresIn: '7d',
        }
    );

    return {accesToken,refreshToken};
   
}

    

const loginOrSignup = async (req, res) => {

    const {phone,adrress}=req.body;
    try {
        let  user= await User.findOne({phone});
        if(!user)
        {
            user = new User({phone,adrress});
            await user.save();
        } else {
            user.adrress=adrress;
            await user.save();
        }

        const {accesToken, refreshToken} = genertaToken(user.toObject());

        res.status(200).json({success:true, accesToken, refreshToken});



    }

    catch (error) {
        res.status(500).json({success:false, message:'failed to login', error: error.message});
        console.log(error);
    }

    //grnerat token jwt write seprate functionfor it
    //send token to user

   

   
}

export {loginOrSignup};
