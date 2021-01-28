# BLOGPOST REST API

The following is a blogpost rest api that allows users to register, login, create posts, like posts, unlike posts, create comments, follow other users, unfollow other users

The common path for all the links is
[Open the App](https://blogspost-api.herokuapp.com/api/v1)

## SETUP

To start the app on the local machine follow the following steps

1. Ensure you have node installed on your machine
2. Clone the repository to a folder on your machine
3. Add the file **.env** to your main folder after cloning
4. Inside the file add the following environment valiables
   1. MONGODB_URI = your mongodb_uri (either for the localhost mongodb or a hosted mongodb such as mongodb atlas).
   2. JWT_SECRET = your jwt secret passcode
5. Install all the dependancies by running the command **npm install**
6. Install the nodemon package globally by running the command **npm install nodemon -g --save**
7. Start your local server by running the command **npm run dev**

### API ACCESS ROUTES

All the routes have the common start API URL which is **\_ (You host)/api/v1** i.e. if on the app its **https://blogspost-api.herokuapp.com/api/v1** or if on the localhost its **http://localhost:5000/api/v1**

#### REGISTER A USER

PATH: **/users/register**

The following are need to register a user
-name
-email
-password

#### LOGIN A USER

PATH: **/users/login**

The following are need to login a user
-email
-password

#### RESET A USER PASSWORD

PATH: **/users/reset-password**

The following are need to reset a user password
-email
-password

#### FOLLOW A USER

PATH: **/users/:follower_id/follow**

The following are needed to follow user
A user must also be logged in and the token passed in the req.header
-follower_id (to be passed as params before /follow)

#### UNFOLLOW A USER

PATH: **/users/:follower_id/unfollow**

The following are needed to unfollow user
A user nust also be logged in and the token passed in the req.header
-follower_id (to be passed as params before /unfollow)

#### GET ALL POSTS

PATH: **/posts/**

#### NOTE: FOR ALL THE REMAINING ABOUT POST A USER MUST BE LOGGED IN AND THE token password in the req.header

#### CREATE A NEW POST

PATH: **/posts/new**

The following are is needed to create the post
-post_content

#### LIKE A POST

PATH: **/posts/:post_id/like**

The following are is needed to like the post
-post_id (passed as parameter before /like)

#### UNLIKE A POST

PATH: **/posts/:post_id/unlike**

The following are is needed to unlike the post
-post_id (passed as parameter before /unlike)

#### DELETE A POST

PATH: **/posts/:post_id/delete**

The following are is needed to delete the post
-post_id (passed as parameter before /delete)

#### COMMENT ON A POST

PATH: **/posts/:post_id/comment**

The following are is needed to comment the post
-post_id (passed as parameter before /comment)
