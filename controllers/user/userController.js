const bcrypt = require("bcryptjs");
const User = require("../../model/User/User");
const { appErr, AppErr } = require("../../utils/appErr");
const generateToken = require('../../utils/generateToken');
const getTokenFormHeader = require("../../utils/getTokenFromHeader");
const Post = require("../../model/Post/Post");
const Category = require("../../model/Category/Category");
const Comment = require("../../model/Comment/Comment");
// register
const userRegisterController = async (req, res, next) =>
{
    const { firstname, lastname, email, password } = req.body;
    try
    {
        // check if user exists
        const userFound = await User.findOne({ email });
        if (userFound)
        {
            return next(new AppErr("User Already Exist", 500));
        }
        // hash user password
        const salt = await bcrypt.genSalt(10);
        const hasedPassword = await bcrypt.hash(password, salt);
        // console.log(salt);
        // create the user 
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hasedPassword,
        });
        res.json({
            status: 'success',
            data: user,
        })
    } catch (error)
    {
        next(appErr(error.message));
    }
}
// Login   
const userLoginController = async (req, res, next) =>
{
    try
    {
        // if email exists
        // validity of the password
        const { email, password } = req.body;
        const userFound = await User.findOne({ email });
        if (!userFound)
        {
            return next(new AppErr("Wrong Login Credientials"));
        }
        //    verified password
        const isPasswordMatched = await bcrypt.compare(password, userFound.password);
        if (!isPasswordMatched)
        {
            return next(new AppErr("Wrong Login Credientials"));
        }
        res.json({
            status: 'success',
            data: {
                firstname: userFound.firstname,
                lastname: userFound.lastname,
                email: userFound.email,
                isAdmin: userFound.isAdmin,
                token: generateToken(userFound._id),
            }
        })
    } catch (error)
    {
        next(appErr(error.message));
    }
}
// user profile controller
const userProfileController = async (req, res) =>
{
    const { id } = req.params;
    try
    {
        const token = getTokenFormHeader(req);
        const user = await User.findById(id);
        res.json({
            status: 'success',
            data: user,
        })
    } catch (error)
    {
        res.json(error.message);
    }
}

const getUserController = async (req, res, next) =>
{
    try
    {
        const user = await User.findById(req.userAuth);
        res.json({
            status: 'success',
            data: user,
        })
    } catch (error)
    {
        next(error.message);
    }
}

const getAllUserController = async (req, res) =>
{
    try
    {

        const users = await User.find();
        res.json({
            status: 'success',
            data: users,

        })
    } catch (error)
    {
        res.json(error.message);
    }
}
const updateUserController = async (req, res, next) =>
{
    const { email ,firstname,lastname} = req.body;
    try
    {
        // Check if email is not taken
        if (email)
        {
            const emailTaken = await User.findOne({ email });
            if (emailTaken)
            {
                return next(appErr("Email is Taken", 400));
            }
        }
        // update  the user
        const user = await User.findByIdAndUpdate(req.userAuth, {
            firstname,
            lastname,
            email,
        }, {
            new: true,
            runValidators: true
        });
        // send response

        res.json({
            status: 'success',
            data: user,

        })
    } catch (error)
    {
        res.json(error.message);
    }
}

const updateUserPwdController = async (req, res,next) =>
{
    const { password} = req.body;
    try
    {
        if (password)
        {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt)
            
            // update user
            const user  = await User.findByIdAndUpdate(req.userAuth,{password:hashedPassword},{new:true},{runValidators:true})
       
        res.json({
            status: 'success',
            data: "password has been updated successfully",

        })
        }
    } catch (error)
    {
        res.json(error.message);
    }
}
// profile photo upload
const profilePhotoUploadController = async (req, res, next) =>
{
    // console.log(req.file);
    try
    {
        // FInd the user to be updated
        const userToUpdate = await User.findById(req.userAuth);

        // console.log(userToUpdate);
        // check if user is found
        if (!userToUpdate)
        {
            return next(appErr("User not Found", 403));
        }
        // Check if user is blocked

        if (userToUpdate.isBlocked)
        {
            return next(appErr("Your account is blocked", 403));
        }

        if (req.file)
        {
            await User.findByIdAndUpdate(req.userAuth, {
                $set: {
                    profilePhoto: req.file.path,
                },
            },
                {
                    new: true,
                }
            );
            res.json({
                status: 'success',
                data: 'profile photo updated successfully',

            });
        }
        // check if user is updating thier photo

        // Update profile photo

    } catch (error)
    {
        next(appErr(error.message, 500));
    }
};
// who viewed my profile controller
const whoViewedMyProfileController = async (req, res, next) =>
{
    try
    {
        // find original user
        const user = await User.findById(req.params.id);
        // console.log(user);
        // Find the user who viewed the origianal user
        const userWhoViewed = await User.findById(req.userAuth);
        // console.log(req.userAuth);
        // check orginal user and who viewed
        if (user && userWhoViewed)
        {
            // check if userWhoViewed is already in the users viewers array
            const isUserAlreadyViewed = user.viewers.find(viewer =>
                viewer.toString() === userWhoViewed._id.toString()
            );
            // console.log(isUserAlreadyViewed);
            if (isUserAlreadyViewed)
            {
                return next(appErr("You already viwed this profile"));
            } else
            {
                // push the userWhoViewed to the user's array
                user.viewers.push(userWhoViewed._id);
                await user.save();
                res.json({
                    status: 'success',
                    data: 'you have successfully viewed this users'

                });
            }
        }
    } catch (error)
    {
        next(appErr(error.message));
    }
}
// following

const followingController = async (req, res, next) =>
{
    try
    {
        // FIND THE USER TO FOLLOW
        const userToFollow = await User.findById(req.params.id);
        // console.log(userToFollow);
        // find the user who is following
        const userWhoFollowed = await User.findById(req.userAuth);
        // console.log(userWhoFollowed);
        // check if user an userWhoFollowed are found

        if (userToFollow && userWhoFollowed)
        {
            // check if userWhoFollowed already followed
            const isUserAlreadyFollowed = userToFollow.following.find(follower => follower.toString() === userWhoFollowed._id.toString())
            // console.log(isUserAlreadyFollowed);
            if (isUserAlreadyFollowed)
            {
                return next(appErr('You already followed this user'))
            } else
            {
                // push userWhoFollowed into the user's followers array
                userToFollow.followers.push(userWhoFollowed._id);
                // push userToFollow to the userWhofollowed following array

                userWhoFollowed.following.push(userToFollow._id);
                // save
                await userWhoFollowed.save();
                await userToFollow.save();
                res.json({
                    status: "success",
                    data: "You successfully follow this user"
                })
            }
        };


    } catch (error)
    {
        next(appErr(error.message));
    }
}

// unfollowing

const unfollowingController = async (req, res, next) =>
{
    try
    {
        // FIND THE USER TO UNFOLLOW
        const userToBeUnFollowed = await User.findById(req.params.id);
        // find the user who is unfollowing
        const userWhoUnFollowed = await User.findById(req.userAuth);
        // check if user an userWhoUnFollowed are found
        if (userToBeUnFollowed && userWhoUnFollowed)
        {
            const isUserAlreadyUnFollowed = userToBeUnFollowed.followers.find(follower => follower.toString() === userToBeUnFollowed._id.toString());
            if (!isUserAlreadyUnFollowed)
            {
                return next(appErr("You have not followed this user"))
            } else
            {
                // remove user from followers array
                userToBeUnFollowed.followers = userWhoUnFollowed.followers.filter(follower => follower.toString() !== userWhoUnFollowed._id.toString())
            }
            // save the user
            await userToBeUnFollowed.save();
            // user
            userWhoUnFollowed.following = userWhoUnFollowed.following.filter(
                following => following.toString !== userToBeUnFollowed._id.toString()

            );
            await userWhoUnFollowed.save();
            res.json({
                status: 'success',
                data: 'You have successfully unfollowed this user',

            })
        }

    } catch (error)
    {
        next(appErr(error.message));
    }
}
// block user
const blockUserController = async (req, res, next) =>
{
    try
    {
        // FIND THE USER TO UNFOLLOW
        const userToBeBlocked = await User.findById(req.params.id);
        // find the user who is unfollowing
        const userWhoBlocked = await User.findById(req.userAuth);
        // check if user an userWhoUnFollowed are found
        if (userToBeBlocked && userWhoBlocked)
        {
            const isUserAlreadyBlocked = userToBeBlocked.followers.find(follower => follower.toString() === userToBeBlocked._id.toString());
            if (!isUserAlreadyBlocked)
            {
                return next(appErr("You have already blocked this user"))
            }
            userWhoBlocked.blocked.push(userToBeBlocked._id);
            res.json({
                status: 'success',
                data: 'You have successfully blocked this user',

            })
            // save the user
            await userWhoBlocked.save();
        }
    } catch (error)
    {
        next(appErr(error.message));
    }
}

// unblock

const unBlockUserController = async (req, res, next) =>
{
    try
    {
        // FIND THE USER TO UNBLOCK
        const userToBeUnBlocked = await User.findById(req.params.id);
        // find the user who is unfollowing
        const userWhoUnBlocked = await User.findById(req.userAuth);
        // check if user an userWhoUnFollowed are found
        if (userToBeUnBlocked && userWhoUnBlocked)
        {
            const isUserAlreadyUnBlocked = userWhoUnBlocked.blocked.find(blocked => blocked.toString() === userToBeUnBlocked._id.toString());
            if (!isUserAlreadyUnBlocked)
            {
                return next(appErr("You have already not blocked this user"))
            }
            userWhoUnBlocked.blocked = userWhoUnBlocked.filter(blocked => blocked.toString !== userToBeUnBlocked._id.toString());
            // userWhoUnBlocked.blocked.push(userToBeUnBlocked._id);

            // save the user
            await userWhoUnBlocked.save();

            res.json({
                status: 'success',
                data: 'You have successfully unblocked this user',

            })

        }

    } catch (error)
    {
        next(appErr(error.message));
    }
}

// admin block

const adminBlockUserController = async (req, res, next) =>
{
    try
    {
        // FIND THE USER TO UNBLOCK
        const userToBeBlocked = await User.findById(req.params.id);
        if (!userToBeBlocked)
        {
            return next(appErr("User not Found"));
        }
        //  chnage the is blocked to true
        userToBeBlocked.isBlocked = true;
        await userToBeBlocked.save();
        res.json({
            status: 'success',
            data: 'You have successfully blocked this user',

        })
    } catch (error)
    {
        next(appErr(error.message));
    }
}

const adminUnBlockUserController = async (req, res, next) =>
{
    try
    {
        // FIND THE USER TO UNBLOCK
        const userToBeUnBlocked = await User.findById(req.params.id);
        if (!userToBeUnBlocked)
        {
            return next(appErr("User not Found"));
        }
        //  chnage the is blocked to true
        userToBeUnBlocked.isBlocked = false;
        await userToBeUnBlocked.save();
        res.json({
            status: 'success',
            data: 'You have successfully unblocked this user',

        })
    } catch (error)
    {
        next(appErr(error.message));
    }
}

const deleteUserController = async (req, res,next) =>
{
    try
    {
        // find user to be deleted

        const userToDelete = await User.findById(req.userAuth);
        // find all posts to be deleted
        await Post.deleteMany({ user: req.userAuth });
        // delete comment related to this user
        await Comment.deleteMany({ user: req.userAuth });
        await Category.deleteMany({ user: req.userAuth });
    //    delete user
        await userToDelete.deleteOne();
        res.json({
            status: 'success',
            data: 'Your account has been deleted successfully',

        })
    } catch (error)
    {
        next(appErr(error.message));
    }
}
module.exports = {
    userRegisterController,
    userLoginController,
    getUserController,
    userProfileController,
    getAllUserController,
    updateUserController,
    deleteUserController,
    profilePhotoUploadController,
    whoViewedMyProfileController,
    followingController,
    unfollowingController,
    blockUserController,
    unBlockUserController,
    adminBlockUserController,
    adminUnBlockUserController,
    updateUserPwdController,
    
}