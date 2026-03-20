import { Router } from "express";
import UsersControllers from "../src/Controllers/Users.Controllers";
import UsersRepository from "../src/Repositories/UsersRepository";
import UsersServices from "../src/Services/UsersServices";
import UsersAutoMapper from "../src/AutoMapper/UsersAutoMapper";

const router = Router();

// Instantiate service with required dependencies
const userServices = new UsersServices(new UsersRepository(), new UsersAutoMapper());

// Instantiate controller with service
const userController = new UsersControllers(userServices);

// =========================================================================================================================================================================================
//                                                                    Create and Authenticate User Account End Points
// =========================================================================================================================================================================================
router.post("/create-account", userController.createUserAccount.bind(userController));
router.post("/login", userController.loginUserAccount.bind(userController));

// =========================================================================================================================================================================================
//                                                                    Get User Information End Points
// =========================================================================================================================================================================================
router.get("/get-user-by-id/:id", userController.getUserAccountById.bind(userController));
router.get("/get-user-by-email/:email", userController.getUserAccountByEmail.bind(userController));
router.get("/get-all-users", userController.findAllUsers.bind(userController));
router.get("/get-paginated-users", userController.findAndPaginated.bind(userController));
router.get("/search-user", userController.searchUserAccount.bind(userController));
router.get("/get-user-online-status/:id", userController.getUserIsOnline.bind(userController));

// =========================================================================================================================================================================================
//                                                                    Update User Information End Points
// =========================================================================================================================================================================================
router.put("/update-user-details/:id", userController.updateUserDetailsAccountById.bind(userController));
router.put("/update-user-role/:id", userController.updateUserRole.bind(userController));
router.put("/update-user-email-password/:id", userController.updateUserEmailAndPasswordById.bind(userController));
router.put("/verify-user/:id", userController.verifyUserAccountById.bind(userController));
router.put("/block-user/:id", userController.blockUserAccountById.bind(userController));
router.put("/set-blocked-user/:id", userController.setBlockedUserAccountById.bind(userController));
router.put("/update-user-offline-status/:id", userController.updateUserIfLogoutOrOffline.bind(userController));
router.put("/update-user-last-active/:id", userController.updateUserLastActiveStatus.bind(userController));

// =========================================================================================================================================================================================
//                                                                    Delete User Account End Points
// =========================================================================================================================================================================================
router.delete("/delete-user/:id", userController.deleteUserAccountById.bind(userController));


export default router;