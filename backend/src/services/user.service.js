const User = require( '../models/user.model' ); 
const bcrypt = require( 'bcrypt' ); 

const getMyProfile = async (userId) => { 
    const user = await User.findById(userId) 
        .select( '-passwordHash' ) 
        .populate( 'departmentId' , 'name description' ); 
    return user; 
}; 

const updateMyProfile = async (userId, data) => { 
    const { name, email } = data; 
    const updateData = {}; 
    
    if (name !== undefined) { 
        updateData.name = name; 
    } 
    
    if (email !== undefined) {
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            throw new Error( 'User not found' );
        }

        if (email !== currentUser.email) {
            const emailExists = await User.findOne({ email }); 
            if (!emailExists) { 
                updateData.email = email; 
            } else { 
                throw new Error( 'Email already exists' ); 
            } 
        }
    }

    const user = await User.findByIdAndUpdate( 
        userId, 
        updateData, 
        { 
            new: true, 
            runValidators: true, 
        }, 
    ) 
    .select( '-passwordHash' ) 
    .populate( 'departmentId' , 'name description' ); 
    return user; 
}; 

const changePassword = async(userId, data) => { 
    const {oldPassword, newPassword} = data; 
    const user = await User.findById(userId); 
    
    if (!user) {
        throw new Error( 'User not found' );
    }

    const passwordCheck = await bcrypt.compare(oldPassword, user.passwordHash); 
    if(!passwordCheck){ 
        throw new Error( 'Old password does not match' ); 
    } 
    
    user.passwordHash = await bcrypt.hash(newPassword, 10); 
    await user.save(); 
    
    return { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
    }; 
} 

  const user = await User.findByIdAndUpdate(
    userId,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  )
    .select("-passwordHash")
    .populate("departmentId", "name description");

  return user;
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};
