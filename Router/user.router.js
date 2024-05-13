import express from 'express';
import { addUser, deleteUser, getUser, getUsers, login, signUp, updateUser } from '../Controller/user.controller';

const router =express.Router();

router.get('/get-users',getUsers);

router.post('/add_user',addUser);

router.get('/get_user/:user_id',getUser);

router.put('/update_user/:user_id',updateUser);

router.delete('/delete_user/:user_id',deleteUser);

router.post('/sign-up',signUp);

router.post('/login',login);

export default router;