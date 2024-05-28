const express = require('express');
const userRouter = require('./routes/users/userRoutes.js');
const postRouter = require('./routes/posts/postRouter.js');
const commentRouter = require('./routes/comments/commentRouter.js');
const categoryRouter = require('./routes/categories/categoryRouter.js');
const bodyParser = require('body-parser');
const globalErrHandler = require('./middleware/globalErrHandler.js');
const isAdmin = require('./middleware/isAdmin.js');
require("dotenv").config();
require('./config/dbConnect.js');


const app = express(express.json()); // pass incoming payload
app.use(bodyParser.json());
// middleware
//   app.use(isAdmin);
const userAuth = {
    isLogin: true,
    isAdmin: true,
};


app.use((req, res,next) =>
{
    if (userAuth.isLogin)
    {
        next();
    } else
    {
        return res.json({
           msg:"Invalid Ligin Credientail"
       }) 
  }
})


//  ROUTES
// #### USER ROUTES
app.use("/api/v1/users", userRouter);

// #### POST ROUTES
app.use("/api/v1/posts", postRouter);

// #### COMMMENT ROUTES
app.use("/api/v1/comments", commentRouter);

// #### CATEGORY ROUTES
app.use("/api/v1/categories", categoryRouter);

//   ##############################################################################################################################################
//   #####                                                                                                                                    #####
//   #####                                                                                                                                    #####
//   #####                                                                                                                                    #####
//   #####                                                                                                                                    #####
//   ##############################################################################################################################################
                                                                                

// ################################################################################################################################################
//##################################################################### POST ROUTES ###############################################################



// Error handlers middleware
app.use(globalErrHandler);
// 404 error
app.use('*', (req, res) =>
{
    res.status(404).json({
        message: `${req.originalUrl} - Route Not Found`,
    });
    
});
// listen to server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () =>
{
    console.log(`Server running on this port ${PORT}`);
}) 